"""
XML Parser for Academic Articles.

Supports:
- JATS (Journal Article Tag Suite) XML format
- Custom/generic XML formats

Extracts:
- Metadata (title, authors, dates, DOI)
- Abstract
- Body sections
- Figures and tables
- References
"""

import re
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from lxml import etree
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


@dataclass
class ParsedAuthor:
    """Represents a parsed author from XML."""
    first_name: str = ''
    last_name: str = ''
    email: str = ''
    affiliation: str = ''
    orcid: str = ''
    is_corresponding: bool = False


@dataclass
class ParsedFigure:
    """Represents a parsed figure from XML."""
    figure_id: str = ''
    label: str = ''
    caption: str = ''
    graphic_href: str = ''


@dataclass
class ParsedTable:
    """Represents a parsed table from XML."""
    table_id: str = ''
    label: str = ''
    caption: str = ''
    table_html: str = ''
    footnotes: str = ''


@dataclass
class ParsedReference:
    """Represents a parsed reference from XML."""
    ref_id: str = ''
    label: str = ''
    authors: str = ''
    title: str = ''
    source: str = ''
    year: str = ''
    volume: str = ''
    pages: str = ''
    doi: str = ''
    full_citation: str = ''


@dataclass
class ParsedArticle:
    """Complete parsed article content."""
    # Metadata
    title: str = ''
    doi: str = ''
    article_id_code: str = ''
    article_type: str = ''
    abstract: str = ''
    keywords: List[str] = field(default_factory=list)
    
    # Dates
    received_date: Optional[str] = None
    revised_date: Optional[str] = None
    accepted_date: Optional[str] = None
    published_date: Optional[str] = None
    
    # Page info
    page_start: str = ''
    page_end: str = ''
    
    # Authors
    authors: List[ParsedAuthor] = field(default_factory=list)
    
    # Content
    abstract_html: str = ''
    body_html: str = ''
    references_html: str = ''
    acknowledgments_html: str = ''
    
    # Extracted elements
    figures: List[ParsedFigure] = field(default_factory=list)
    tables: List[ParsedTable] = field(default_factory=list)
    references: List[ParsedReference] = field(default_factory=list)
    
    # Parsing info
    success: bool = False
    errors: List[str] = field(default_factory=list)


class BaseXMLParser:
    """Base class for XML parsers."""
    
    def __init__(self, xml_content: str):
        self.xml_content = xml_content
        self.tree = None
        self.root = None
        self.errors = []
    
    def parse(self) -> ParsedArticle:
        """Parse the XML and return structured content."""
        raise NotImplementedError
    
    def _parse_xml(self) -> bool:
        """Parse the XML string into an element tree."""
        try:
            # Clean up XML: handle whitespace
            xml_clean = self.xml_content.strip()
            
            # Use etree with a parser that handles common issues and DTDs
            # We enable load_dtd and resolve_entities to handle JATS DTD properly
            parser = etree.XMLParser(
                recover=True, 
                encoding='utf-8',
                remove_blank_text=True,
                load_dtd=True,
                resolve_entities=True,
                no_network=False  # Allow network to fetch DTDs if needed
            )
            
            # We convert to bytes for etree.fromstring
            self.tree = etree.fromstring(xml_clean.encode('utf-8'), parser=parser)
            self.root = self.tree
            
            if self.root is None:
                self.errors.append('XML parsed to empty tree')
                return False
                
            return True
        except etree.XMLSyntaxError as e:
            self.errors.append(f'XML syntax error: {str(e)}')
            return False
        except Exception as e:
            logger.exception('Failed to parse XML string')
            self.errors.append(f'Failed to parse XML: {str(e)}')
            return False
    
    def _get_text(self, element, xpath: str, default: str = '') -> str:
        """Get text content from an element using xpath."""
        if element is None:
            return default
        result = element.xpath(xpath)
        if result:
            if isinstance(result[0], str):
                return result[0].strip()
            return etree.tostring(result[0], method='text', encoding='unicode').strip()
        return default

    def _find_any(self, parent, paths: List[str]):
        """Find the first matching element from a list of paths."""
        if parent is None:
            return None
        for path in paths:
            elem = parent.find(path)
            if elem is not None:
                return elem
        return None
    
    def _element_to_html(self, element, preserve_tags: List[str] = None) -> str:
        """Convert an XML element to HTML string."""
        if element is None:
            return ''
        
        # Convert to string and clean up
        html = etree.tostring(element, method='html', encoding='unicode')
        
        # Use BeautifulSoup for cleaner HTML
        soup = BeautifulSoup(html, 'html.parser')
        return str(soup)


class JATSParser(BaseXMLParser):
    """
    Parser for JATS (Journal Article Tag Suite) XML format.
    
    JATS is the standard XML format used by most academic publishers
    including PMC, PLoS, and many others.
    """
    
    # JATS namespaces
    NAMESPACES = {
        'xlink': 'http://www.w3.org/1999/xlink',
        'mml': 'http://www.w3.org/1998/Math/MathML',
        'ali': 'http://www.niso.org/schemas/ali/1.0/',
        'xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    }
    
    def parse(self) -> ParsedArticle:
        """Parse JATS XML and return structured content."""
        result = ParsedArticle()
        
        if not self._parse_xml():
            result.errors = self.errors
            return result
        
        try:
            # Parse metadata
            result.title = self._parse_title()
            result.doi = self._parse_doi()
            result.article_id_code = self._parse_article_id_code()
            result.article_type = self.root.get('article-type', '')
            result.abstract = self._parse_abstract_text()
            result.keywords = self._parse_keywords()
            
            # Parse dates
            result.received_date = self._parse_date('received')
            result.revised_date = self._parse_date('rev-recd')
            result.accepted_date = self._parse_date('accepted')
            result.published_date = self._parse_date('epub') or self._parse_date('pub')
            
            # Parse page info
            result.page_start = self._get_text(self.root, './/fpage')
            result.page_end = self._get_text(self.root, './/lpage')
            
            # Parse authors
            result.authors = self._parse_authors()
            
            # Parse content sections
            result.abstract_html = self._parse_abstract_html()
            result.body_html = self._parse_body()
            result.references_html = self._parse_references_html()
            result.acknowledgments_html = self._parse_acknowledgments()
            
            # Extract figures and tables
            result.figures = self._parse_figures()
            result.tables = self._parse_tables()
            result.references = self._parse_references()
            
            result.success = True
            
        except Exception as e:
            logger.exception('Error parsing JATS XML')
            result.errors.append(f'Parsing error: {str(e)}')
        
        result.errors.extend(self.errors)
        return result
    
    def _to_title_case(self, text: str) -> str:
        """Convert a string to Title Case (Camel Case style)."""
        if not text:
            return ""
        
        # Simple title case first
        text = text.strip()
        
        # Split by whitespace, capitalize first letter of each word, 
        # but keep certain academic words/abbreviations if they are already uppercase
        words = text.split()
        result_words = []
        
        # Minor words that should usually be lowercase unless at the start
        minor_words = {'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in'}
        
        for i, word in enumerate(words):
            # If word is an abbreviation (like DOI, DNA, RNA, HIV), keep it as is
            if word.isupper() and len(word) > 1:
                result_words.append(word)
            elif i == 0 or word.lower() not in minor_words:
                # Capitalize first letter, keep rest as is or lowercase? 
                # User said "Camel Case" which usually means Title Case for headings.
                # We'll capitalize the first letter and keep the rest of the word's casing 
                # (to preserve things like 'pH' or 'mRNA')
                if len(word) > 1:
                    result_words.append(word[0].upper() + word[1:])
                else:
                    result_words.append(word.upper())
            else:
                result_words.append(word.lower())
                
        return " ".join(result_words)

    def _parse_title(self) -> str:
        """Extract article title - following XSLT patterns."""
        # Try article-title in title-group/article-meta (like XSLT)
        title_elem = self._find_any(self.root, [
            './/front/article-meta/title-group/article-title',
            './/article-meta/title-group/article-title',
            './/article-title',
            './/title',
            './/ArticleTitle'
        ])
        if title_elem is not None:
            # Convert inline elements (bold, italic, etc.) to plain text for title
            title_text = self._convert_inline_elements(title_elem)
            # Remove HTML tags for plain text title
            title_text = re.sub(r'<[^>]+>', '', title_text)
            # Apply Title Case cleanup
            return self._to_title_case(title_text)
        return ''
    
    def _parse_doi(self) -> str:
        """Extract DOI - following XSLT patterns."""
        # Try article-id with pub-id-type="doi" in article-meta (like XSLT)
        doi_elem = self._find_any(self.root, [
            './/front/article-meta/article-id[@pub-id-type="doi"]',
            './/article-meta/article-id[@pub-id-type="doi"]',
            './/article-id[@pub-id-type="doi"]'
        ])
        if doi_elem is not None and doi_elem.text:
            return doi_elem.text.strip()
        
        # Fallback: search for DOI pattern in any article-id
        for elem in self.root.findall('.//article-id'):
            if elem.text and '10.' in elem.text:
                return elem.text.strip()
        
        # Also check pub-id elements
        for elem in self.root.findall('.//pub-id[@pub-id-type="doi"]'):
            if elem.text:
                return elem.text.strip()
                
        return ''

    def _parse_article_id_code(self) -> str:
        """Extract publisher's article ID code."""
        # Try article-id with pub-id-type="publisher-id"
        id_elem = self._find_any(self.root, [
            './/front/article-meta/article-id[@pub-id-type="publisher-id"]',
            './/article-meta/article-id[@pub-id-type="publisher-id"]',
            './/article-id[@pub-id-type="publisher-id"]'
        ])
        if id_elem is not None and id_elem.text:
            return id_elem.text.strip()
        return ''

    def _parse_date(self, date_type: str) -> Optional[str]:
        """Extract a date of a specific type (received, accepted, etc.)."""
        # For pub-date
        if date_type in ['epub', 'pub']:
            xpath = f'.//pub-date[@pub-type="{date_type}"]'
            date_elem = self.root.find(xpath)
            if date_elem is not None:
                return self._extract_date_from_elem(date_elem)
            
            # Fallback for any pub-date
            if date_type == 'pub':
                date_elem = self.root.find('.//pub-date')
                if date_elem is not None:
                    return self._extract_date_from_elem(date_elem)
        
        # For history dates
        xpath = f'.//history/date[@date-type="{date_type}"]'
        date_elem = self.root.find(xpath)
        if date_elem is not None:
            return self._extract_date_from_elem(date_elem)
            
        return None

    def _extract_date_from_elem(self, date_elem) -> Optional[str]:
        """Extract YYYY-MM-DD from a date element containing day/month/year."""
        year = date_elem.find('year')
        month = date_elem.find('month')
        day = date_elem.find('day')
        
        if year is not None and year.text:
            y = year.text.strip()
            m = month.text.strip() if month is not None and month.text else '01'
            d = day.text.strip() if day is not None and day.text else '01'
            
            # Ensure 2 digits for month and day
            m = m.zfill(2)
            d = d.zfill(2)
            
            return f"{y}-{m}-{d}"
        return None
    
    def _parse_abstract_text(self) -> str:
        """Extract abstract as plain text - following XSLT patterns."""
        # Try abstract in article-meta first (like XSLT)
        abstract_elem = self._find_any(self.root, [
            './/front/article-meta/abstract',
            './/article-meta/abstract',
            './/abstract',
            './/summary',
            './/Abstract'
        ])
        if abstract_elem is not None:
            # Get text content, preserving structure
            text_parts = []
            for p in abstract_elem.findall('.//p'):
                p_text = etree.tostring(p, method='text', encoding='unicode').strip()
                if p_text:
                    text_parts.append(p_text)
            
            if text_parts:
                return ' '.join(text_parts)
            else:
                # Fallback to all text
                return etree.tostring(abstract_elem, method='text', encoding='unicode').strip()
        return ''
    
    def _parse_abstract_html(self) -> str:
        """Parse abstract with structure preserved as HTML - following XSLT patterns."""
        # Try abstract in article-meta first (like XSLT)
        abstract_elem = self._find_any(self.root, [
            './/front/article-meta/abstract',
            './/article-meta/abstract',
            './/abstract',
            './/summary',
            './/Abstract'
        ])
        
        if abstract_elem is None:
            return ''
        
        html_parts = ['<div class="article-abstract">']
        
        # Check for title (like XSLT words-for-abstract-title)
        title = abstract_elem.find('title')
        if title is not None:
            title_text = self._convert_inline_elements(title)
            # Remove HTML tags for Title Case application
            clean_title = re.sub(r'<[^>]+>', '', title_text)
            title_text = self._to_title_case(clean_title)
            html_parts.append(f'<h2 class="abstract-title">{title_text}</h2>')
        
        # Process all content except title
        has_content = False
        
        for child in abstract_elem:
            tag = child.tag
            if '}' in tag: tag = tag.split('}', 1)[1]
            
            if tag == 'title':
                continue  # Already handled
            elif tag == 'sec':
                # Structured abstract sections (Background, Methods, Results, etc.)
                sec_title = child.find('title')
                title_text = ''
                if sec_title is not None:
                    title_text = self._convert_inline_elements(sec_title)
                    # Remove HTML tags for Title Case application
                    clean_title = re.sub(r'<[^>]+>', '', title_text)
                    title_text = self._to_title_case(clean_title)
                
                html_parts.append(f'<section class="abstract-section">')
                if title_text:
                    html_parts.append(f'<h3 class="abstract-section-title">{title_text}</h3>')
                
                for subchild in child:
                    if subchild.tag == 'title': continue
                    if '}' in subchild.tag:
                        sub_tag = subchild.tag.split('}', 1)[1]
                    else:
                        sub_tag = subchild.tag
                    
                    if sub_tag == 'p':
                        html_parts.append(self._parse_paragraph(subchild))
                    else:
                        html_parts.append(self._convert_inline_elements(subchild))
                html_parts.append('</section>')
                has_content = True
            elif tag == 'p':
                html_parts.append(self._parse_paragraph(child))
                has_content = True
            else:
                # Handle unexpected tags by converting them
                content = self._convert_inline_elements(child)
                if content:
                    html_parts.append(content)
                    has_content = True

        # Fallback: if no tags were processed but there is text
        if not has_content:
            text = etree.tostring(abstract_elem, method='text', encoding='unicode').strip()
            if text:
                html_parts.append(f'<p>{text}</p>')
        
        html_parts.append('</div>')
        return '\n'.join(html_parts)
    
    def _parse_keywords(self) -> List[str]:
        """Extract keywords from all kwd-group elements."""
        keywords = []
        for kwd_group in self.root.findall('.//kwd-group'):
            for kwd in kwd_group.findall('kwd'):
                text = etree.tostring(kwd, method='text', encoding='unicode').strip()
                if text and text not in keywords:
                    keywords.append(text)
        return keywords
    
    def _parse_authors(self) -> List[ParsedAuthor]:
        """Parse all authors from contrib-group."""
        authors = []
        
        # Try different ways authors are listed
        contrib_group = self.root.find('.//contrib-group')
        author_elements = []
        
        if contrib_group is not None:
            author_elements = contrib_group.findall('contrib[@contrib-type="author"]')
        else:
            # Fallback: search for any contrib with type author anywhere
            author_elements = self.root.findall('.//contrib[@contrib-type="author"]')
            
        # If still nothing, try looking for common author tags
        if not author_elements:
            for tag in ['author', 'Author']:
                author_elements.extend(self.root.findall(f'.//{tag}'))
        
        # Get affiliations (from both contrib-group and article-meta)
        affiliations = {}
        for aff in self.root.findall('.//aff'):
            aff_id = aff.get('id', '')
            aff_text = etree.tostring(aff, method='text', encoding='unicode').strip()
            # Clean up affiliation text - remove label if present
            label = aff.find('label')
            if label is not None:
                label_text = etree.tostring(label, method='text', encoding='unicode').strip()
                aff_text = aff_text.replace(label_text, '', 1).strip()
            aff_text = re.sub(r'^[\d\w]+\s*', '', aff_text)  # Remove leading ID
            if aff_id:
                affiliations[aff_id] = aff_text
        
        # Get correspondence info
        corresp_map = {}
        for corresp in self.root.findall('.//corresp'):
            corresp_id = corresp.get('id', '')
            email = corresp.find('.//email')
            if email is not None and email.text:
                corresp_map[corresp_id] = email.text.strip()
        
        for contrib in author_elements:
            author = ParsedAuthor()
            
            # Name
            name = contrib.find('.//name')
            if name is not None:
                surname = name.find('surname')
                given = name.find('given-names')
                author.last_name = surname.text if surname is not None and surname.text else ''
                author.first_name = given.text if given is not None and given.text else ''
            else:
                # Try collab (collaboration/group author)
                collab = contrib.find('.//collab')
                if collab is not None:
                    author.last_name = etree.tostring(collab, method='text', encoding='unicode').strip()
                else:
                    # Try simple text content if no <name> structure
                    full_name = etree.tostring(contrib, method='text', encoding='unicode').strip()
                    if full_name:
                        parts = full_name.split(' ', 1)
                        if len(parts) > 1:
                            author.first_name, author.last_name = parts
                        else:
                            author.last_name = full_name
            
            # Email - check multiple locations
            email = contrib.find('.//email')
            if email is not None and email.text:
                author.email = email.text.strip()
            else:
                # Check xlink:href on email element
                email_elem = contrib.find('.//email[@{http://www.w3.org/1999/xlink}href]')
                if email_elem is not None:
                    author.email = email_elem.get('{http://www.w3.org/1999/xlink}href', '').replace('mailto:', '')
            
            # ORCID - check contrib-id with contrib-id-type="orcid"
            contrib_id = contrib.find('.//contrib-id[@contrib-id-type="orcid"]')
            if contrib_id is not None and contrib_id.text:
                author.orcid = contrib_id.text.strip()
            else:
                # Also check for contrib-id without type attribute
                for cid in contrib.findall('.//contrib-id'):
                    if cid.text and 'orcid.org' in cid.text.lower():
                        author.orcid = cid.text.strip()
                        break
            
            # Corresponding author - check multiple ways
            corresp_attr = contrib.get('corresp', 'no')
            if corresp_attr.lower() in ['yes', 'true', '1']:
                author.is_corresponding = True
            
            # Always check for xref to corresp to get email even if corresp="yes"
            corresp_xref = contrib.find('.//xref[@ref-type="corresp"]')
            if corresp_xref is not None:
                author.is_corresponding = True
                corresp_id = corresp_xref.get('rid', '')
                if corresp_id in corresp_map and not author.email:
                    author.email = corresp_map[corresp_id]
            
            # Affiliation - check xref first
            xref = contrib.find('.//xref[@ref-type="aff"]')
            if xref is not None:
                aff_id = xref.get('rid', '')
                author.affiliation = affiliations.get(aff_id, '')
            elif not author.affiliation:
                # Try finding affiliation directly in author tag
                aff_inner = contrib.find('.//aff')
                if aff_inner is not None:
                    aff_text = etree.tostring(aff_inner, method='text', encoding='unicode').strip()
                    # Remove label
                    label = aff_inner.find('label')
                    if label is not None:
                        label_text = etree.tostring(label, method='text', encoding='unicode').strip()
                        aff_text = aff_text.replace(label_text, '', 1).strip()
                    author.affiliation = aff_text
            
            if author.first_name or author.last_name:
                authors.append(author)
        
        return authors
    
    def _parse_body(self) -> str:
        """Parse article body into HTML - following XSLT make-body template."""
        # Look for body element (like XSLT)
        body = self._find_any(self.root, ['.//body', './/Body', './/content'])
        
        if body is None:
            # If no body, try to find the article element and take everything after front
            article_elem = self.root
            if article_elem is not None:
                html_parts = ['<div class="article-body">']
                for child in article_elem:
                    tag = child.tag
                    if '}' in tag: tag = tag.split('}', 1)[1]
                    if tag not in ['front', 'abstract', 'title-group', 'article-meta', 'back']:
                        html_parts.append(self._convert_inline_elements(child))
                html_parts.append('</div>')
                if len(html_parts) > 2:
                    return '\n'.join(html_parts)
            return ''
        
        html_parts = ['<div class="article-body">']
        has_content = False
        
        # Process all children of body (like XSLT apply-templates)
        for child in body:
            tag = child.tag
            if '}' in tag: tag = tag.split('}', 1)[1]
            
            if tag == 'sec':
                html_parts.append(self._parse_section(child))
                has_content = True
            elif tag == 'p':
                html_parts.append(self._parse_paragraph(child))
                has_content = True
            elif tag == 'fig' or tag == 'fig-group':
                # Figures are handled but not displayed inline (like XSLT suppresses them)
                # We'll still parse them for metadata but not show in body
                if tag == 'fig':
                    html_parts.append(self._parse_figure_html(child))
                    has_content = True
            elif tag == 'table-wrap' or tag == 'table-wrap-group':
                html_parts.append(self._parse_table_html(child))
                has_content = True
            elif tag == 'list':
                html_parts.append(self._parse_list(child))
                has_content = True
            elif tag == 'disp-formula':
                formula_id = child.get('id', '')
                formula_content = self._convert_inline_elements(child, is_display=True)
                html_parts.append(f'<div class="display-formula" id="{formula_id}"><br/>{formula_content}</div>')
                has_content = True
            elif tag == 'disp-quote':
                quote_content = self._convert_inline_elements(child)
                html_parts.append(f'<blockquote>{quote_content}</blockquote>')
                has_content = True
            elif tag == 'preformat':
                pre_content = etree.tostring(child, method='text', encoding='unicode')
                html_parts.append(f'<pre>{pre_content}</pre>')
                has_content = True
            elif tag == 'boxed-text':
                boxed_content = self._convert_inline_elements(child)
                html_parts.append(f'<table border="4" cellpadding="10pt" width="100%"><tr><td valign="top">{boxed_content}</td></tr></table>')
                has_content = True
            else:
                # Handle unexpected tags by converting them
                content = self._convert_inline_elements(child)
                if content:
                    html_parts.append(content)
                    has_content = True

        # Fallback for text-heavy bodies without tags
        if not has_content:
            text = etree.tostring(body, method='text', encoding='unicode').strip()
            if text:
                html_parts.append(f'<p>{text}</p>')
        
        html_parts.append('</div>')
        return '\n'.join(html_parts)
    
    def _parse_section(self, section_elem, level: int = 2) -> str:
        """Parse a section element into HTML."""
        html_parts = []
        
        sec_id = section_elem.get('id', '')
        sec_type = section_elem.get('sec-type', '')
        
        # Section title and label
        label = section_elem.find('label')
        title = section_elem.find('title')
        
        title_text = ''
        if title is not None:
            title_text = self._convert_inline_elements(title)
            # Remove HTML tags for Title Case application
            clean_title = re.sub(r'<[^>]+>', '', title_text)
            title_text = self._to_title_case(clean_title)
            
        label_text = ''
        if label is not None:
            label_text = self._convert_inline_elements(label)
            # Labels like "Section 1" should also be Title Case
            clean_label = re.sub(r'<[^>]+>', '', label_text)
            label_text = self._to_title_case(clean_label)
            
        if title_text or label_text:
            tag = f'h{min(level, 6)}'
            full_title = f'<span class="section-label">{label_text}</span> {title_text}' if label_text else title_text
            html_parts.append(f'<{tag} class="section-title" id="{sec_id}">{full_title}</{tag}>')
        
        html_parts.append(f'<section class="article-section" data-section-type="{sec_type}">')
        
        # Process child elements
        for child in section_elem:
            tag = child.tag
            if '}' in tag: tag = tag.split('}', 1)[1]
            
            if tag in ['title', 'label']:
                continue  # Already handled
            elif tag == 'sec':
                # Nested section
                html_parts.append(self._parse_section(child, level + 1))
            elif tag == 'p':
                html_parts.append(self._parse_paragraph(child))
            elif tag == 'fig':
                html_parts.append(self._parse_figure_html(child))
            elif tag == 'table-wrap':
                html_parts.append(self._parse_table_html(child))
            elif tag == 'list':
                html_parts.append(self._parse_list(child))
            elif tag == 'disp-formula':
                formula_id = child.get('id', '')
                formula_content = self._convert_inline_elements(child, is_display=True)
                html_parts.append(f'<div class="display-formula" id="{formula_id}"><br/>{formula_content}</div>')
            elif tag == 'chem-struct-wrapper':
                chem_id = child.get('id', '')
                chem_content = self._convert_inline_elements(child)
                html_parts.append(f'<div class="chem-struct" id="{chem_id}"><br/>{chem_content}</div>')
            elif tag == 'boxed-text':
                boxed_content = self._convert_inline_elements(child)
                html_parts.append(f'<table border="4" cellpadding="10pt" width="100%"><tr><td valign="top">{boxed_content}</td></tr></table>')
            elif tag == 'supplementary-material':
                supp_content = self._convert_inline_elements(child)
                html_parts.append(f'<div class="supplementary-material">{supp_content}</div>')
            else:
                # Handle unexpected tags
                content = self._convert_inline_elements(child)
                if content:
                    html_parts.append(content)
        
        html_parts.append('</section>')
        return '\n'.join(html_parts)
    
    def _parse_paragraph(self, p_elem) -> str:
        """Parse a paragraph element."""
        # Get inner content, converting inline elements
        inner_html = self._convert_inline_elements(p_elem)
        # Clean up multiple spaces and strip
        inner_html = re.sub(r'\s+', ' ', inner_html).strip()
        if not inner_html:
            return ''
        return f'<p>{inner_html}</p>'
    
    def _convert_inline_elements(self, elem, is_display: bool = False) -> str:
        """Convert JATS inline elements to HTML."""
        if elem is None:
            return ''
            
        parts = []
        
        # Handle text before children
        if elem.text:
            text = re.sub(r'\s+', ' ', elem.text)
            if is_display and text.strip() and not any(tag in text for tag in ['<math', 'mjx-']):
                # If display context and we have raw text, treat as TeX display math
                parts.append(f'\\[{text}\\]')
            else:
                parts.append(text)
        
        for child in elem:
            # Handle JATS namespaces
            tag = child.tag
            if '}' in tag:
                tag = tag.split('}', 1)[1]
            
            if tag in ['bold', 'b']:
                parts.append(f'<strong>{self._convert_inline_elements(child, is_display)}</strong>')
            elif tag in ['italic', 'i']:
                parts.append(f'<em>{self._convert_inline_elements(child, is_display)}</em>')
            elif tag == 'sup':
                parts.append(f'<sup>{self._convert_inline_elements(child, is_display)}</sup>')
            elif tag == 'sub':
                parts.append(f'<sub>{self._convert_inline_elements(child, is_display)}</sub>')
            elif tag == 'math' or 'math' in tag.lower():
                # Preserve MathML for MathJax
                # We use method='xml' to ensure all MathML tags are preserved exactly
                try:
                    mathml_content = etree.tostring(child, method='xml', encoding='unicode', with_tail=False)
                    
                    # Ensure MathML namespace is present for standalone rendering
                    if 'xmlns:mml' not in mathml_content and 'mml:' in mathml_content:
                        mathml_content = mathml_content.replace('<mml:math', '<mml:math xmlns:mml="http://www.w3.org/1998/Math/MathML"')
                    elif 'xmlns=' not in mathml_content and '<math' in mathml_content:
                        mathml_content = mathml_content.replace('<math', '<math xmlns="http://www.w3.org/1998/Math/MathML"')
                    
                    # If this is a display formula, force display="block" attribute if missing
                    if is_display and 'display="block"' not in mathml_content:
                        if '<mml:math' in mathml_content:
                            mathml_content = mathml_content.replace('<mml:math', '<mml:math display="block"')
                        elif '<math' in mathml_content:
                            mathml_content = mathml_content.replace('<math', '<math display="block"')

                    parts.append(f'<span class="math-container">{mathml_content}</span>')
                except Exception as e:
                    logger.warning(f"Failed to stringify MathML element: {str(e)}")
                    parts.append(self._convert_inline_elements(child, is_display))
            elif tag == 'tex-math':
                # Handle TeX math
                math_text = child.text or ""
                if is_display:
                    parts.append(f'<span class="tex-math">\\[{math_text}\\]</span>')
                else:
                    parts.append(f'<span class="tex-math">\\({math_text}\\)</span>')
            elif tag == 'underline':
                parts.append(f'<u>{self._convert_inline_elements(child, is_display)}</u>')
            elif tag == 'sc':
                parts.append(f'<span style="font-variant: small-caps;">{self._convert_inline_elements(child, is_display)}</span>')
            elif tag == 'monospace':
                parts.append(f'<code>{self._convert_inline_elements(child, is_display)}</code>')
            elif tag == 'xref':
                ref_type = child.get('ref-type', '')
                rid = child.get('rid', '')
                text = self._convert_inline_elements(child, is_display)
                if ref_type == 'bibr':
                    # Ensure consistent ref- prefix for internal linking
                    target_id = rid if rid.startswith('ref-') else f'ref-{rid}'
                    parts.append(f'<a href="#{target_id}" class="citation-ref">{text}</a>')
                elif ref_type == 'fig':
                    parts.append(f'<a href="#fig-{rid}" class="figure-ref">{text}</a>')
                elif ref_type == 'table':
                    parts.append(f'<a href="#table-{rid}" class="table-ref">{text}</a>')
                else:
                    parts.append(text)
            elif tag == 'ext-link':
                href = child.get('{http://www.w3.org/1999/xlink}href', '#')
                text = self._convert_inline_elements(child, is_display) or href
                parts.append(f'<a href="{href}" target="_blank" rel="noopener">{text}</a>')
            elif tag == 'inline-graphic' or tag == 'graphic':
                href = child.get('{http://www.w3.org/1999/xlink}href', '')
                # Remove extension for placeholder
                href_base = href.rsplit('.', 1)[0] if '.' in href else href
                parts.append(f'<img src="{{{{FIGURE:{href_base}}}}}" class="article-image" alt="graphic">')
            elif tag == 'named-content':
                content_type = child.get('content-type', '')
                content = self._convert_inline_elements(child, is_display)
                if content_type:
                    parts.append(f'<span class="named-content" data-type="{content_type}">[{content_type}: {content}]</span>')
                else:
                    parts.append(content)
            elif tag == 'abbrev':
                abbrev_text = self._convert_inline_elements(child, is_display)
                href = child.get('{http://www.w3.org/1999/xlink}href', '')
                if href:
                    parts.append(f'<abbr title="{href}">{abbrev_text}</abbr>')
                else:
                    parts.append(f'<abbr>{abbrev_text}</abbr>')
            elif tag == 'disp-quote':
                quote_content = self._convert_inline_elements(child, is_display)
                parts.append(f'<blockquote>{quote_content}</blockquote>')
            elif tag == 'preformat':
                pre_content = etree.tostring(child, method='text', encoding='unicode')
                parts.append(f'<pre>{pre_content}</pre>')
            elif tag == 'p':
                parts.append(f'<p>{self._convert_inline_elements(child, is_display)}</p>')
            elif tag == 'title':
                parts.append(f'<h4>{self._convert_inline_elements(child, is_display)}</h4>')
            else:
                # Default: handle children recursively
                content = self._convert_inline_elements(child, is_display)
                if content:
                    parts.append(content)
            
            # Handle text after children (tail)
            if child.tail:
                # Collapse whitespace in tail nodes
                text = re.sub(r'\s+', ' ', child.tail)
                if is_display and text.strip() and not any(tag in text for tag in ['<math', 'mjx-']):
                    parts.append(f'\\[{text}\\]')
                else:
                    parts.append(text)
        
        return ''.join(parts)
    
    def _parse_list(self, list_elem) -> str:
        """Parse a list element."""
        list_type = list_elem.get('list-type', 'bullet')
        tag = 'ol' if list_type in ['order', 'ordered', 'number'] else 'ul'
        
        html_parts = [f'<{tag} class="article-list">']
        
        for item in list_elem.findall('list-item'):
            item_content = self._convert_inline_elements(item)
            html_parts.append(f'<li>{item_content}</li>')
        
        html_parts.append(f'</{tag}>')
        return '\n'.join(html_parts)
    
    def _parse_figure_html(self, fig_elem) -> str:
        """Parse a figure element into HTML - following XSLT patterns."""
        fig_id = fig_elem.get('id', '')
        
        label = fig_elem.find('label')
        label_text = self._convert_inline_elements(label) if label is not None else ''
        # Ensure label is Title Case (e.g., "Figure 1")
        label_text = self._to_title_case(re.sub(r'<[^>]+>', '', label_text))
        
        caption = fig_elem.find('caption')
        caption_html = ''
        if caption is not None:
            # Process caption title if present
            caption_title = caption.find('title')
            if caption_title is not None:
                title_text = self._convert_inline_elements(caption_title)
                # Apply Title Case
                title_text = self._to_title_case(re.sub(r'<[^>]+>', '', title_text))
                caption_html += f'<span class="table_caption_title">{title_text}</span>'
            
            # Process paragraphs and other content
            for child in caption:
                tag = child.tag
                if '}' in tag: tag = tag.split('}', 1)[1]
                
                if tag == 'title':
                    continue  # Already handled
                elif tag == 'p':
                    caption_html += self._parse_paragraph(child)
                else:
                    caption_html += self._convert_inline_elements(child)
        
        # Find graphic - check multiple locations
        graphic = fig_elem.find('.//graphic')
        graphic_href = ''
        if graphic is not None:
            graphic_href = graphic.get('{http://www.w3.org/1999/xlink}href', '')
            # Remove extension for placeholder matching
            if graphic_href:
                graphic_href = graphic_href.rsplit('.', 1)[0] if '.' in graphic_href else graphic_href
        
        # Build HTML similar to XSLT fig template
        html = f'''<figure id="fig-{fig_id}" class="article-figure">
    <div class="figure-content">
        <img src="{{{{FIGURE:{graphic_href}}}}}" alt="{label_text}" class="article-figure-image" loading="lazy">
    </div>
    <figcaption class="figure-caption">
        <strong>{label_text}.</strong> {caption_html}
    </figcaption>
</figure>'''
        return html
    
    def _parse_table_html(self, table_wrap) -> str:
        """Parse a table-wrap element into HTML - following XSLT patterns."""
        table_id = table_wrap.get('id', '')
        
        label = table_wrap.find('label')
        label_text = self._convert_inline_elements(label) if label is not None else ''
        # Ensure label is Title Case (e.g., "Table 1")
        label_text = self._to_title_case(re.sub(r'<[^>]+>', '', label_text))
        
        caption = table_wrap.find('caption')
        caption_html = ''
        if caption is not None:
            # Process caption title if present
            caption_title = caption.find('title')
            if caption_title is not None:
                title_text = self._convert_inline_elements(caption_title)
                # Apply Title Case
                title_text = self._to_title_case(re.sub(r'<[^>]+>', '', title_text))
                caption_html += f'<span class="table_caption_title">{title_text}</span>'
            
            # Process paragraphs and other content
            for child in caption:
                tag = child.tag
                if '}' in tag: tag = tag.split('}', 1)[1]
                
                if tag == 'title':
                    continue  # Already handled
                elif tag == 'p':
                    caption_html += self._parse_paragraph(child)
                else:
                    caption_html += self._convert_inline_elements(child)
        
        # Get the table content
        table = table_wrap.find('.//table')
        table_html = ''
        if table is not None:
            # Convert table with proper styling like XSLT
            table_html = self._convert_table_to_html(table)
        
        # Table footnotes
        footnotes_html = ''
        table_foot = table_wrap.find('.//table-wrap-foot')
        if table_foot is not None:
            footnotes = []
            for fn in table_foot.findall('.//fn'):
                fn_text = self._convert_inline_elements(fn)
                if fn_text:
                    footnotes.append(f'<div class="table-footnote">{fn_text}</div>')
            if footnotes:
                footnotes_html = f'<div class="table-wrap-foot">{chr(10).join(footnotes)}</div>'
        
        html = f'''<div id="table-{table_id}" class="article-table">
    <div class="table-caption">
        <span class="table_wrap_label">{label_text}.</span> {caption_html}
    </div>
    <div class="table_responsive">
        {table_html}
    </div>
    {footnotes_html}
</div>'''
        return html
    
    def _convert_table_to_html(self, table_elem) -> str:
        """Convert table element to HTML with proper styling."""
        # Add border styling like XSLT
        table_html = etree.tostring(table_elem, method='html', encoding='unicode')
        
        # Add inline styles for borders (like XSLT does)
        table_html = table_html.replace('<table', '<table style="border: solid thin #000; padding:1pt;" cellpadding="1" cellspacing="1" frame="border" rules="all"')
        table_html = table_html.replace('<th', '<th style="border: solid thin #000; padding:1pt;"')
        table_html = table_html.replace('<td', '<td style="border: solid thin #000; padding:1pt;" valign="top"')
        
        return table_html
    
    def _parse_figures(self) -> List[ParsedFigure]:
        """Extract all figures metadata."""
        figures = []
        
        for fig in self.root.findall('.//fig'):
            parsed_fig = ParsedFigure()
            parsed_fig.figure_id = fig.get('id', '')
            
            label = fig.find('label')
            parsed_fig.label = label.text if label is not None and label.text else ''
            
            caption = fig.find('caption')
            if caption is not None:
                parsed_fig.caption = etree.tostring(caption, method='text', encoding='unicode').strip()
            
            graphic = fig.find('.//graphic')
            if graphic is not None:
                parsed_fig.graphic_href = graphic.get('{http://www.w3.org/1999/xlink}href', '')
            
            figures.append(parsed_fig)
        
        return figures
    
    def _parse_tables(self) -> List[ParsedTable]:
        """Extract all tables metadata."""
        tables = []
        
        for table_wrap in self.root.findall('.//table-wrap'):
            parsed_table = ParsedTable()
            parsed_table.table_id = table_wrap.get('id', '')
            
            label = table_wrap.find('label')
            parsed_table.label = label.text if label is not None and label.text else ''
            
            caption = table_wrap.find('caption')
            if caption is not None:
                parsed_table.caption = etree.tostring(caption, method='text', encoding='unicode').strip()
            
            table = table_wrap.find('.//table')
            if table is not None:
                parsed_table.table_html = etree.tostring(table, method='html', encoding='unicode')
            
            # Table footnotes
            footnotes = []
            for fn in table_wrap.findall('.//table-wrap-foot//fn'):
                fn_text = etree.tostring(fn, method='text', encoding='unicode').strip()
                footnotes.append(fn_text)
            parsed_table.footnotes = '\n'.join(footnotes)
            
            tables.append(parsed_table)
        
        return tables
    
    def _parse_references(self) -> List[ParsedReference]:
        """Extract all references - supports multiple citation formats like XSLT."""
        references = []
        
        ref_list = self.root.find('.//ref-list')
        if ref_list is None:
            return references
        
        for ref in ref_list.findall('ref'):
            parsed_ref = ParsedReference()
            parsed_ref.ref_id = ref.get('id', '')
            
            label = ref.find('label')
            parsed_ref.label = label.text if label is not None and label.text else ''
            
            # Try different citation formats (element-citation, mixed-citation, nlm-citation)
            citation = self._find_any(ref, [
                './/nlm-citation',
                './/element-citation',
                './/mixed-citation',
                './/citation'
            ])
            
            if citation is not None:
                citation_type = citation.get('citation-type', 'journal')
                
                # Authors - handle person-group with different types
                authors = []
                for person_group in citation.findall('.//person-group'):
                    group_type = person_group.get('person-group-type', 'author')
                    if group_type == 'author':
                        for name in person_group.findall('.//name'):
                            surname = name.find('surname')
                            given = name.find('given-names')
                            if surname is not None and surname.text:
                                author = surname.text
                                if given is not None and given.text:
                                    # Use full given names or initials based on citation style
                                    author += f' {given.text}'
                                authors.append(author)
                
                # Also check for names directly in citation
                if not authors:
                    for name in citation.findall('.//name'):
                        surname = name.find('surname')
                        given = name.find('given-names')
                        if surname is not None and surname.text:
                            author = surname.text
                            if given is not None and given.text:
                                author += f' {given.text}'
                            authors.append(author)
                
                parsed_ref.authors = ', '.join(authors)
                
                # Title
                article_title = citation.find('article-title')
                if article_title is not None:
                    parsed_ref.title = etree.tostring(article_title, method='text', encoding='unicode').strip()
                
                # Source (journal name, book title, etc.)
                source = citation.find('source')
                if source is not None:
                    parsed_ref.source = etree.tostring(source, method='text', encoding='unicode').strip()
                
                # Year
                year = citation.find('year')
                if year is not None and year.text:
                    parsed_ref.year = year.text.strip()
                
                # Volume
                volume = citation.find('volume')
                if volume is not None and volume.text:
                    parsed_ref.volume = volume.text.strip()
                
                # Issue
                issue = citation.find('issue')
                if issue is not None and issue.text:
                    parsed_ref.volume += f'({issue.text})' if parsed_ref.volume else issue.text
                
                # Pages
                fpage = citation.find('fpage')
                lpage = citation.find('lpage')
                if fpage is not None and fpage.text:
                    parsed_ref.pages = fpage.text
                    if lpage is not None and lpage.text:
                        parsed_ref.pages += f'-{lpage.text}'
                
                # DOI - check multiple locations
                doi = citation.find('.//pub-id[@pub-id-type="doi"]')
                if doi is not None and doi.text:
                    parsed_ref.doi = doi.text.strip()
                else:
                    # Also check article-id
                    for aid in citation.findall('.//article-id'):
                        if aid.get('pub-id-type') == 'doi' and aid.text:
                            parsed_ref.doi = aid.text.strip()
                            break
                
                # Build full citation text (Vancouver style like XSLT)
                citation_parts = []
                if parsed_ref.authors:
                    citation_parts.append(parsed_ref.authors)
                if parsed_ref.title:
                    citation_parts.append(parsed_ref.title)
                if parsed_ref.source:
                    citation_parts.append(f'<em>{parsed_ref.source}</em>')
                if parsed_ref.year:
                    citation_parts.append(parsed_ref.year)
                if parsed_ref.volume:
                    citation_parts.append(f'<strong>{parsed_ref.volume}</strong>')
                if parsed_ref.pages:
                    citation_parts.append(f'pp. {parsed_ref.pages}')
                if parsed_ref.doi:
                    citation_parts.append(f'DOI: <a href="http://dx.doi.org/{parsed_ref.doi}" target="_blank">{parsed_ref.doi}</a>')
                
                parsed_ref.full_citation = '. '.join([p for p in citation_parts if p])
            else:
                # Fallback: use text content
                parsed_ref.full_citation = etree.tostring(ref, method='text', encoding='unicode').strip()
            
            references.append(parsed_ref)
        
        return references
    
    def _parse_references_html(self) -> str:
        """Parse references section into HTML - Consistent numbered list."""
        ref_list = self.root.find('.//ref-list')
        if ref_list is None:
            return ''
        
        html_parts = ['<div class="references-list-container">']
        
        for i, ref in enumerate(ref_list.findall('ref'), 1):
            original_id = ref.get('id', str(i))
            # Ensure consistent ref- prefix for ID redirection
            ref_id = original_id if original_id.startswith('ref-') else f'ref-{original_id}'
            
            label = ref.find('label')
            # Extract number from label if possible, otherwise use index
            label_text = label.text if label is not None and label.text else str(i)
            # Strip any periods or brackets from existing label
            label_text = re.sub(r'[.\s\[\]]+', '', label_text)
            if not label_text:
                label_text = str(i)
            
            citation_html = self._build_citation_html(ref)
            
            # Use a structure that's easy to style as [1] Text
            html_parts.append(f'''<div class="reference-line" id="{ref_id}">
    <div class="reference-label">{label_text}</div>
    <div class="reference-content">{citation_html}</div>
</div>''')
            
        html_parts.append('</div>')
        return '\n'.join(html_parts)
    
    def _build_citation_html(self, ref_elem) -> str:
        """Build HTML for a single citation - following XSLT patterns."""
        citation = self._find_any(ref_elem, [
            './/nlm-citation',
            './/element-citation',
            './/mixed-citation',
            './/citation'
        ])
        
        if citation is None:
            # Fallback to text content, but remove the label if it's there
            text = etree.tostring(ref_elem, method='text', encoding='unicode').strip()
            label = ref_elem.find('label')
            if label is not None and label.text:
                text = text.replace(label.text, '', 1).strip()
            return text
        
        parts = []
        # ... rest of the method remains the same ...
        citation_type = citation.get('citation-type', 'journal')
        
        # Authors
        authors = []
        for person_group in citation.findall('.//person-group[@person-group-type="author"]'):
            for name in person_group.findall('.//name'):
                surname = name.find('surname')
                given = name.find('given-names')
                if surname is not None and surname.text:
                    author = surname.text
                    if given is not None and given.text:
                        # Remove periods from given names for Vancouver style
                        given_clean = given.text.replace('.', '')
                        author += f' {given_clean}'
                    authors.append(author)
        
        if authors:
            # Limit to 6 authors, then "et al."
            if len(authors) > 6:
                parts.append(', '.join(authors[:3]) + ', <em>et al.</em>')
            else:
                parts.append(', '.join(authors))
        
        # Title
        article_title = citation.find('article-title')
        if article_title is not None:
            title_text = self._convert_inline_elements(article_title)
            parts.append(title_text)
        
        # Source (journal/book)
        source = citation.find('source')
        if source is not None:
            source_text = etree.tostring(source, method='text', encoding='unicode').strip()
            parts.append(source_text)
        
        # Year
        year = citation.find('year')
        if year is not None and year.text:
            parts.append(year.text.strip())
        
        # Volume and Issue
        volume = citation.find('volume')
        issue = citation.find('issue')
        if volume is not None and volume.text:
            vol_text = volume.text.strip()
            if issue is not None and issue.text:
                vol_text += f'({issue.text.strip()})'
            parts.append(vol_text)
        elif issue is not None and issue.text:
            parts.append(f'({issue.text.strip()})')
        
        # Pages
        fpage = citation.find('fpage')
        lpage = citation.find('lpage')
        if fpage is not None and fpage.text:
            page_text = fpage.text.strip()
            if lpage is not None and lpage.text:
                # Smart page range compression like XSLT
                lpage_text = lpage.text.strip()
                if len(page_text) > 0 and len(lpage_text) > 0:
                    # Try to compress: 123-128 -> 123-8
                    if page_text.startswith(lpage_text[:len(page_text)]):
                        page_text += '-' + lpage_text[len(page_text):]
                    else:
                        page_text += '-' + lpage_text
            parts.append(f'pp. {page_text}')
        
        # DOI
        doi = citation.find('.//pub-id[@pub-id-type="doi"]')
        if doi is not None and doi.text:
            doi_text = doi.text.strip()
            parts.append(f'<br/>DOI: <a href="http://dx.doi.org/{doi_text}" target="_blank">{doi_text}</a>')
        
        return '. '.join([p for p in parts if p])
    
    def _parse_acknowledgments(self) -> str:
        """Parse acknowledgments section."""
        ack = self.root.find('.//ack')
        if ack is None:
            return ''
        
        html_parts = ['<section class="acknowledgments">']
        
        # Check for title
        title = ack.find('title')
        if title is not None:
            title_text = self._convert_inline_elements(title)
            # Apply Title Case
            title_text = self._to_title_case(re.sub(r'<[^>]+>', '', title_text))
            html_parts.append(f'<h2>{title_text}</h2>')
        else:
            html_parts.append('<h2>Acknowledgments</h2>')
        
        # Process all content
        for child in ack:
            tag = child.tag
            if '}' in tag: tag = tag.split('}', 1)[1]
            
            if tag == 'title':
                continue  # Already handled
            elif tag == 'p':
                html_parts.append(self._parse_paragraph(child))
            elif tag == 'sec':
                html_parts.append(self._parse_section(child))
            else:
                content = self._convert_inline_elements(child)
                if content:
                    html_parts.append(content)
        
        html_parts.append('</section>')
        return '\n'.join(html_parts)


class GenericXMLParser(BaseXMLParser):
    """
    Generic XML parser for non-JATS formats.
    """
    
    def parse(self) -> ParsedArticle:
        """Parse generic XML and return structured content."""
        result = ParsedArticle()
        
        if not self._parse_xml():
            result.errors = self.errors
            return result
        
        try:
            # Try to find common elements
            result.title = self._find_title()
            result.abstract = self._find_abstract()
            result.abstract_html = f'<div class="article-abstract">{result.abstract}</div>'
            result.body_html = self._find_body()
            
            result.success = True
            
        except Exception as e:
            logger.exception('Error parsing generic XML')
            result.errors.append(f'Parsing error: {str(e)}')
        
        result.errors.extend(self.errors)
        return result
    
    def _find_title(self) -> str:
        """Try to find article title."""
        for tag in ['title', 'article-title', 'Title', 'ArticleTitle', 'name', 'Name']:
            elem = self.root.find(f'.//{tag}')
            if elem is not None and elem.text:
                text = etree.tostring(elem, method='text', encoding='unicode').strip()
                return re.sub(r'\s+', ' ', text)
        return ''
    
    def _find_abstract(self) -> str:
        """Try to find abstract."""
        for tag in ['abstract', 'Abstract', 'summary', 'Summary', 'description', 'Description']:
            elem = self.root.find(f'.//{tag}')
            if elem is not None:
                text = etree.tostring(elem, method='text', encoding='unicode').strip()
                return re.sub(r'\s+', ' ', text)
        return ''
    
    def _find_body(self) -> str:
        """Try to find body content."""
        for tag in ['body', 'Body', 'content', 'Content', 'text', 'Text', 'article', 'Article', 'xml', 'XML']:
            elem = self.root.find(f'.//{tag}')
            if elem is not None:
                html = etree.tostring(elem, method='html', encoding='unicode')
                return f'<div class="article-body">{html}</div>'
        
        # Absolute fallback: if no body tag found, use the entire root content
        html = etree.tostring(self.root, method='html', encoding='unicode')
        return f'<div class="article-body">{html}</div>'


def detect_xml_format(xml_content: str) -> str:
    """
    Detect the format of an XML document.
    """
    if not xml_content:
        return 'unknown'
    
    # Check for JATS indicators
    content_lower = xml_content.lower()
    
    if '<article' in content_lower and ('dtd-version' in content_lower or 'article-type' in content_lower):
        return 'jats'
    
    if '<front' in content_lower and '<body' in content_lower:
        return 'jats'
    
    if 'jats' in content_lower:
        return 'jats'
    
    # Generic check
    if xml_content.strip().startswith('<'):
        return 'generic'
    
    return 'unknown'


def parse_article_xml(xml_content: str) -> ParsedArticle:
    """
    Main entry point for parsing article XML.
    
    Automatically detects the XML format and uses the appropriate parser.
    Defaults to GenericXMLParser if format is not specifically JATS.
    """
    if not xml_content or not xml_content.strip():
        result = ParsedArticle()
        result.errors.append('Empty XML content')
        return result

    format_type = detect_xml_format(xml_content)
    
    if format_type == 'jats':
        parser = JATSParser(xml_content)
    else:
        # Default to generic parser for anything that looks like XML or even just text
        parser = GenericXMLParser(xml_content)
    
    return parser.parse()

















