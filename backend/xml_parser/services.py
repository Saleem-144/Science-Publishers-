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
    
    def process_xml_file(self, article_file: ArticleFile) -> bool:
        """
        Process an XML file attached to an article.
        
        Args:
            article_file: ArticleFile instance with file_type='xml'
        
        Returns:
            True if processing succeeded, False otherwise
        """
        if article_file.file_type != 'xml':
            self.errors.append('File is not an XML file')
            return False
        
        try:
            # Read XML content
            article_file.file.seek(0)
            xml_content = article_file.file.read().decode('utf-8')
            
            return self.process_xml_content(xml_content)
            
        except UnicodeDecodeError:
            self.errors.append('Could not decode XML file as UTF-8')
            return False
        except Exception as e:
            logger.exception('Error processing XML file')
            self.errors.append(f'Error reading file: {str(e)}')
            return False
    
    def process_xml_content(self, xml_content: str) -> bool:
        """
        Process XML content string.
        
        Args:
            xml_content: Raw XML string
        
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
            
            # Store parsed content
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
            if parsed.title and not self.article.title:
                self.article.title = parsed.title
            
            if parsed.doi and not self.article.doi:
                self.article.doi = parsed.doi
            
            if parsed.abstract and not self.article.abstract:
                self.article.abstract = parsed.abstract
            
            if parsed.keywords and not self.article.keywords:
                self.article.keywords = parsed.keywords
            
            self.article.save()
            
            # Update status
            html_content.parsing_status = ParsingStatus.SUCCESS
            html_content.parsing_errors = ''
            html_content.parsed_at = timezone.now()
            html_content.save()
            
            logger.info(f'Successfully parsed XML for article {self.article.id}')
            return True
            
        except Exception as e:
            logger.exception('Error processing XML content')
            html_content.parsing_status = ParsingStatus.FAILED
            html_content.parsing_errors = str(e)
            html_content.parsed_at = timezone.now()
            html_content.save()
            self.errors.append(f'Processing error: {str(e)}')
            return False
    
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
            
            return self.process_xml_content(html_content.original_xml)
            
        except ArticleHTMLContent.DoesNotExist:
            self.errors.append('No HTML content record found')
            return False


def process_article_xml(article_id: int, xml_content: str = None) -> Dict:
    """
    Convenience function to process XML for an article.
    
    Args:
        article_id: Article ID
        xml_content: Optional XML content string. If not provided,
                     will look for an uploaded XML file.
    
    Returns:
        Dict with 'success' boolean and 'errors' list
    """
    try:
        article = Article.objects.get(pk=article_id)
    except Article.DoesNotExist:
        return {'success': False, 'errors': ['Article not found']}
    
    service = XMLProcessingService(article)
    
    if xml_content:
        success = service.process_xml_content(xml_content)
    else:
        # Try to find XML file
        xml_file = ArticleFile.objects.filter(
            article=article,
            file_type='xml'
        ).order_by('-created_at').first()
        
        if not xml_file:
            return {'success': False, 'errors': ['No XML file found for article']}
        
        success = service.process_xml_file(xml_file)
    
    return {
        'success': success,
        'errors': service.errors
    }
















