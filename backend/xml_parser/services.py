"""
XML Processing Service.

Handles the complete workflow of:
1. Receiving uploaded XML
2. Parsing the content
3. Storing parsed HTML
4. Managing figure references
"""

import logging
import re
from typing import Optional, Dict, List
from django.utils import timezone
from django.conf import settings

from articles.models import (
    Article, ArticleHTMLContent, ArticleFile,
    Figure, Table, ParsingStatus
)
from .parser import parse_article_xml, ParsedArticle

logger = logging.getLogger(__name__)


class XMLProcessingService:
    """
    Service for processing XML files and updating article content.
    """
    
    def __init__(self, article: Article):
        self.article = article
        self.errors = []
    
    def process_xml_file(self, file_obj=None, force_update_metadata: bool = False) -> bool:
        """
        Process an XML file attached to an article.
        """
        try:
            xml_content = ""
            source = ""
            if file_obj:
                source = "provided file object"
                if hasattr(file_obj, 'file') and hasattr(file_obj.file, 'open'):
                    file_obj.file.open('rb')
                    xml_content = file_obj.file.read().decode('utf-8', errors='ignore')
                    file_obj.file.close()
                else:
                    file_obj.seek(0)
                    xml_content = file_obj.read().decode('utf-8', errors='ignore')
            elif self.article.xml_file:
                source = f"article.xml_file ({self.article.xml_file.name})"
                self.article.xml_file.open('rb')
                xml_content = self.article.xml_file.read().decode('utf-8', errors='ignore')
                self.article.xml_file.close()
            else:
                # Fallback to ArticleFile related model
                article_file = ArticleFile.objects.filter(
                    article=self.article, 
                    file_type='xml'
                ).order_by('-created_at').first()
                
                if article_file:
                    source = f"ArticleFile ({article_file.file.name})"
                    article_file.file.open('rb')
                    xml_content = article_file.file.read().decode('utf-8', errors='ignore')
                    article_file.file.close()
                else:
                    self.errors.append('No XML file found for article')
                    return False
            
            if not xml_content:
                self.errors.append('XML file is empty')
                return False

            logger.info(f"Processing XML for article {self.article.id} from {source}. Content length: {len(xml_content)}")
            return self.process_xml_content(xml_content, force_update_metadata=force_update_metadata)
            
        except UnicodeDecodeError:
            self.errors.append('Could not decode XML file as UTF-8')
            return False
        except Exception as e:
            logger.exception('Error processing XML file')
            self.errors.append(f'Error reading file: {str(e)}')
            return False
    
    def process_xml_content(self, xml_content: str, force_update_metadata: bool = False) -> bool:
        """
        Process XML content string.
        
        Args:
            xml_content: Raw XML string
            force_update_metadata: If True, overwrite article title/abstract even if they exist
        
        Returns:
            True if processing succeeded, False otherwise
        """
        # Get or create HTML content record
        html_content, created = ArticleHTMLContent.objects.get_or_create(
            article=self.article
        )
        
        # Update status to processing
        html_content.parsing_status = ParsingStatus.PROCESSING
        html_content.save()
        
        try:
            # Store original XML
            html_content.original_xml = xml_content
            
            # Parse the XML
            parsed = parse_article_xml(xml_content)
            
            if not parsed.success:
                html_content.parsing_status = ParsingStatus.FAILED
                html_content.parsing_errors = '\n'.join(parsed.errors)
                html_content.parsed_at = timezone.now()
                html_content.save()
                self.errors.extend(parsed.errors)
                return False
            
            # Store parsed content (ALWAYS overwrite these)
            html_content.abstract_html = parsed.abstract_html
            html_content.body_html = self._resolve_figure_references(parsed.body_html)
            html_content.references_html = parsed.references_html
            html_content.acknowledgments_html = parsed.acknowledgments_html
            
            # Store metadata as JSON
            html_content.figures_json = [
                {
                    'id': f.figure_id,
                    'label': f.label,
                    'caption': f.caption,
                    'graphic_href': f.graphic_href
                }
                for f in parsed.figures
            ]
            
            html_content.tables_json = [
                {
                    'id': t.table_id,
                    'label': t.label,
                    'caption': t.caption
                }
                for t in parsed.tables
            ]
            
            # Create Figure and Table records
            self._create_figure_records(parsed.figures)
            self._create_table_records(parsed.tables)
            
            # Update article metadata if available
            # We overwrite if forced OR if current content is placeholder
            update_meta = force_update_metadata
            
            if parsed.title and (update_meta or not self.article.title or len(self.article.title) < 10 or self.article.title == 'Untitled Article' or 'Processing' in self.article.title):
                logger.info(f"Updating title for article {self.article.id} from XML")
                self.article.title = parsed.title
                
                # Also update slug if it's currently based on a placeholder or if we are forcing
                # but only if it's a relatively new/draft article
                from django.utils.text import slugify
                import uuid
                new_slug = f"{slugify(parsed.title[:250])}-{uuid.uuid4().hex[:8]}"
                
                if update_meta or not self.article.slug or 'untitled' in self.article.slug or 'processing' in self.article.slug:
                    logger.info(f"Updating slug for article {self.article.id} from XML title")
                    self.article.slug = new_slug
            
            if parsed.doi and (update_meta or not self.article.doi or self.article.doi == ''):
                logger.info(f"Updating DOI for article {self.article.id} from XML")
                self.article.doi = parsed.doi
            
            if parsed.article_id_code and (update_meta or not self.article.article_id_code or self.article.article_id_code == ''):
                logger.info(f"Updating Article ID Code for article {self.article.id} from XML")
                self.article.article_id_code = parsed.article_id_code
            
            if parsed.article_type and (update_meta or not self.article.article_type or self.article.article_type == 'research'):
                # Map XML article-type to model choices
                type_map = {
                    'research-article': 'research',
                    'review-article': 'review',
                    'case-report': 'case_report',
                    'short-communication': 'short_communication',
                    'editorial': 'editorial',
                    'letter': 'letter',
                    'commentary': 'commentary',
                    'book-review': 'book_review'
                }
                mapped_type = type_map.get(parsed.article_type.lower())
                if mapped_type:
                    logger.info(f"Updating Article Type for article {self.article.id} to {mapped_type}")
                    self.article.article_type = mapped_type
            
            # Update dates if available
            if parsed.received_date and (update_meta or not self.article.received_date):
                self.article.received_date = parsed.received_date
            if parsed.revised_date and (update_meta or not self.article.revised_date):
                self.article.revised_date = parsed.revised_date
            if parsed.accepted_date and (update_meta or not self.article.accepted_date):
                self.article.accepted_date = parsed.accepted_date
            if parsed.published_date and (update_meta or not self.article.published_date):
                self.article.published_date = parsed.published_date
            
            # Update page info
            if parsed.page_start and (update_meta or not self.article.page_start):
                self.article.page_start = parsed.page_start
            if parsed.page_end and (update_meta or not self.article.page_end):
                self.article.page_end = parsed.page_end
            
            if parsed.abstract and (update_meta or not self.article.abstract or len(self.article.abstract) < 20):
                logger.info(f"Updating abstract for article {self.article.id} from XML")
                self.article.abstract = parsed.abstract
            
            if parsed.keywords and (update_meta or not self.article.keywords or len(self.article.keywords) == 0):
                logger.info(f"Updating keywords for article {self.article.id} from XML")
                self.article.keywords = parsed.keywords
                if update_meta or not self.article.keywords_display:
                    self.article.keywords_display = ', '.join(parsed.keywords)
            
            self.article.save()
            
            # Create Author records
            self._create_author_records(parsed.authors, force_update=update_meta)
            
            # Update status
            html_content.parsing_status = ParsingStatus.SUCCESS
            html_content.parsing_errors = ''
            html_content.parsed_at = timezone.now()
            
            # CRITICAL: Explicitly save all changed fields
            html_content.save()
            
            logger.info(f'Successfully parsed and saved XML content for article {self.article.id}. Status: {html_content.parsing_status}')
            return True
            
        except Exception as e:
            logger.exception('Error processing XML content')
            html_content.parsing_status = ParsingStatus.FAILED
            html_content.parsing_errors = str(e)
            html_content.parsed_at = timezone.now()
            html_content.save()
            self.errors.append(f'Processing error: {str(e)}')
            return False
    
    def _create_author_records(self, authors: list, force_update: bool = False):
        """Create or update Author records from parsed data."""
        from articles.models import Author, ArticleAuthor
        
        # If forcing update, we remove current article-author associations 
        # but keep the Author records themselves as they might be used elsewhere
        if force_update and self.article.article_authors.exists():
            logger.info(f"Removing existing authors for article {self.article.id} to refresh from XML")
            self.article.article_authors.all().delete()
        
        # Only create if the article has no authors yet
        if self.article.authors.exists():
            return
            
        for i, auth in enumerate(authors):
            # Try to find existing author by name and email
            author = None
            if auth.email:
                author = Author.objects.filter(email__iexact=auth.email).first()
            
            if not author:
                author = Author.objects.create(
                    first_name=auth.first_name,
                    last_name=auth.last_name,
                    email=auth.email,
                    affiliation=auth.affiliation,
                    orcid_id=auth.orcid
                )
            
            ArticleAuthor.objects.get_or_create(
                article=self.article,
                author=author,
                defaults={
                    'author_order': i + 1,
                    'is_corresponding': auth.is_corresponding
                }
            )
    
    def _resolve_figure_references(self, body_html: str) -> str:
        """
        Replace figure placeholders with actual image URLs.
        
        The parser outputs {{FIGURE:filename}} placeholders.
        This method replaces them with actual media URLs.
        """
        if not body_html:
            return body_html
        
        # Get all figures for this article
        figures = Figure.objects.filter(article=self.article)
        figure_map = {}
        
        for fig in figures:
            if fig.image:
                # Map various forms of the filename
                filename = fig.original_filename or fig.image.name.split('/')[-1]
                figure_map[filename] = fig.image.url
                
                # Also map without extension and with figure_id
                base_name = filename.rsplit('.', 1)[0] if '.' in filename else filename
                figure_map[base_name] = fig.image.url
                
                if fig.figure_id:
                    figure_map[fig.figure_id] = fig.image.url
        
        # Replace placeholders
        def replace_placeholder(match):
            ref = match.group(1)
            # Try to find matching figure
            if ref in figure_map:
                return figure_map[ref]
            # Try partial matches
            for key, url in figure_map.items():
                if ref in key or key in ref:
                    return url
            # Return placeholder URL for missing figures
            return f'/media/placeholder.png'
        
        resolved = re.sub(r'\{\{FIGURE:([^}]+)\}\}', replace_placeholder, body_html)
        return resolved
    
    def _create_figure_records(self, figures: list):
        """Create or update Figure records from parsed data."""
        # Don't delete existing figures that might have images
        existing_ids = set(
            Figure.objects.filter(article=self.article).values_list('figure_id', flat=True)
        )
        
        for i, fig in enumerate(figures):
            if fig.figure_id in existing_ids:
                # Update existing
                Figure.objects.filter(
                    article=self.article,
                    figure_id=fig.figure_id
                ).update(
                    label=fig.label,
                    caption=fig.caption,
                    display_order=i
                )
            else:
                # Create new (without image - to be uploaded separately)
                Figure.objects.create(
                    article=self.article,
                    figure_id=fig.figure_id,
                    figure_number=i + 1,
                    label=fig.label,
                    caption=fig.caption,
                    display_order=i
                )
    
    def _create_table_records(self, tables: list):
        """Create or update Table records from parsed data."""
        # Clear existing tables
        Table.objects.filter(article=self.article).delete()
        
        for i, tbl in enumerate(tables):
            Table.objects.create(
                article=self.article,
                table_id=tbl.table_id,
                table_number=i + 1,
                label=tbl.label,
                caption=tbl.caption,
                table_html=tbl.table_html,
                footnotes=tbl.footnotes,
                display_order=i
            )
    
    def reparse(self) -> bool:
        """
        Re-parse the stored XML content.
        
        Useful when the parsing logic has been updated.
        """
        try:
            html_content = self.article.html_content
            if not html_content or not html_content.original_xml:
                self.errors.append('No XML content to re-parse')
                return False
            
            # When manually reparsing, we force update metadata
            return self.process_xml_content(html_content.original_xml, force_update_metadata=True)
            
        except ArticleHTMLContent.DoesNotExist:
            self.errors.append('No HTML content record found')
            return False


def process_article_xml(article_id: int, xml_content: str = None, force_update_metadata: bool = False) -> Dict:
    """
    Convenience function to process XML for an article.
    
    Args:
        article_id: Article ID
        xml_content: Optional XML content string. If not provided,
                     will look for an uploaded XML file.
        force_update_metadata: Whether to overwrite existing title/abstract
    
    Returns:
        Dict with 'success' boolean and 'errors' list
    """
    try:
        article = Article.objects.get(pk=article_id)
    except Article.DoesNotExist:
        return {'success': False, 'errors': ['Article not found']}
    
    service = XMLProcessingService(article)
    
    if xml_content:
        success = service.process_xml_content(xml_content, force_update_metadata=force_update_metadata)
    else:
        # Default to forcing metadata update if it's a file-based process (usually means a new upload)
        success = service.process_xml_file(force_update_metadata=True)
    
    return {
        'success': success,
        'errors': service.errors
    }

















