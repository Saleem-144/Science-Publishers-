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
    abstract: str = ''
    keywords: List[str] = field(default_factory=list)
    
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
            # Remove XML declaration if present to avoid encoding issues
            xml_clean = re.sub(r'<\?xml[^>]+\?>', '', self.xml_content).strip()
            self.tree = etree.fromstring(xml_clean.encode('utf-8'))
            self.root = self.tree
            return True
        except etree.XMLSyntaxError as e:
            self.errors.append(f'XML syntax error: {str(e)}')
            return False
        except Exception as e:
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
            result.abstract = self._parse_abstract_text()
            result.keywords = self._parse_keywords()
            
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
    
    def _parse_title(self) -> str:
        """Extract article title."""
        title_elem = self.root.find('.//article-title')
        if title_elem is not None:
            return etree.tostring(title_elem, method='text', encoding='unicode').strip()
        return ''
    
    def _parse_doi(self) -> str:
        """Extract DOI."""
        # Try article-id with pub-id-type="doi"
        doi_elem = self.root.find('.//article-id[@pub-id-type="doi"]')
        if doi_elem is not None and doi_elem.text:
            return doi_elem.text.strip()
        return ''
    
    def _parse_abstract_text(self) -> str:
        """Extract abstract as plain text."""
        abstract_elem = self.root.find('.//abstract')
        if abstract_elem is not None:
            return etree.tostring(abstract_elem, method='text', encoding='unicode').strip()
        return ''
    
    def _parse_abstract_html(self) -> str:
        """Parse abstract with structure preserved as HTML."""
        abstract_elem = self.root.find('.//abstract')
        if abstract_elem is None:
            return ''
        
        html_parts = ['<div class="article-abstract">']
        
        # Check for structured abstract
        sections = abstract_elem.findall('.//sec')
        if sections:
            for section in sections:
                title = section.find('title')
                title_text = title.text if title is not None and title.text else ''
                
                html_parts.append(f'<section class="abstract-section">')
                if title_text:
                    html_parts.append(f'<h3 class="abstract-section-title">{title_text}</h3>')
                
                for p in section.findall('p'):
                    p_text = etree.tostring(p, method='text', encoding='unicode').strip()
                    html_parts.append(f'<p>{p_text}</p>')
                
                html_parts.append('</section>')
        else:
            # Simple abstract
            for p in abstract_elem.findall('.//p'):
                p_text = etree.tostring(p, method='text', encoding='unicode').strip()
                html_parts.append(f'<p>{p_text}</p>')
        
        html_parts.append('</div>')
        return '\n'.join(html_parts)
    
    def _parse_keywords(self) -> List[str]:
        """Extract keywords."""
        keywords = []
        kwd_group = self.root.find('.//kwd-group')
        if kwd_group is not None:
            for kwd in kwd_group.findall('kwd'):
                if kwd.text:
                    keywords.append(kwd.text.strip())
        return keywords
    
    def _parse_authors(self) -> List[ParsedAuthor]:
        """Parse all authors from contrib-group."""
        authors = []
        
        contrib_group = self.root.find('.//contrib-group')
        if contrib_group is None:
            return authors
        
        # Get affiliations
        affiliations = {}
        for aff in self.root.findall('.//aff'):
            aff_id = aff.get('id', '')
            aff_text = etree.tostring(aff, method='text', encoding='unicode').strip()
            # Clean up affiliation text
            aff_text = re.sub(r'^[\d\w]+\s*', '', aff_text)  # Remove leading ID
            affiliations[aff_id] = aff_text
        
        for contrib in contrib_group.findall('contrib[@contrib-type="author"]'):
            author = ParsedAuthor()
            
            # Name
            name = contrib.find('.//name')
            if name is not None:
                surname = name.find('surname')
                given = name.find('given-names')
                author.last_name = surname.text if surname is not None and surname.text else ''
                author.first_name = given.text if given is not None and given.text else ''
            
            # Email
            email = contrib.find('.//email')
            if email is not None and email.text:
                author.email = email.text.strip()
            
            # ORCID
            contrib_id = contrib.find('.//contrib-id[@contrib-id-type="orcid"]')
            if contrib_id is not None and contrib_id.text:
                author.orcid = contrib_id.text.strip()
            
            # Corresponding author
            corresp = contrib.get('corresp', 'no')
            author.is_corresponding = corresp.lower() == 'yes'
            
            # Affiliation
            xref = contrib.find('.//xref[@ref-type="aff"]')
            if xref is not None:
                aff_id = xref.get('rid', '')
                author.affiliation = affiliations.get(aff_id, '')
            
            authors.append(author)
        
        return authors
    
    def _parse_body(self) -> str:
        """Parse article body into HTML."""
        body = self.root.find('.//body')
        if body is None:
            return ''
        
        html_parts = ['<div class="article-body">']
        
        for section in body.findall('.//sec'):
            html_parts.append(self._parse_section(section))
        
        html_parts.append('</div>')
        return '\n'.join(html_parts)
    
    def _parse_section(self, section_elem, level: int = 2) -> str:
        """Parse a section element into HTML."""
        html_parts = []
        
        sec_id = section_elem.get('id', '')
        sec_type = section_elem.get('sec-type', '')
        
        html_parts.append(f'<section id="{sec_id}" class="article-section" data-section-type="{sec_type}">')
        
        # Section title
        title = section_elem.find('title')
        if title is not None and title.text:
            tag = f'h{min(level, 6)}'
            html_parts.append(f'<{tag} class="section-title">{title.text}</{tag}>')
        
        # Process child elements
        for child in section_elem:
            if child.tag == 'title':
                continue  # Already handled
            elif child.tag == 'sec':
                # Nested section
                html_parts.append(self._parse_section(child, level + 1))
            elif child.tag == 'p':
                html_parts.append(self._parse_paragraph(child))
            elif child.tag == 'fig':
                html_parts.append(self._parse_figure_html(child))
            elif child.tag == 'table-wrap':
                html_parts.append(self._parse_table_html(child))
            elif child.tag == 'list':
                html_parts.append(self._parse_list(child))
        
        html_parts.append('</section>')
        return '\n'.join(html_parts)
    
    def _parse_paragraph(self, p_elem) -> str:
        """Parse a paragraph element."""
        # Get inner content, converting inline elements
        inner_html = self._convert_inline_elements(p_elem)
        return f'<p>{inner_html}</p>'
    
    def _convert_inline_elements(self, elem) -> str:
        """Convert JATS inline elements to HTML."""
        parts = []
        
        if elem.text:
            parts.append(elem.text)
        
        for child in elem:
            if child.tag == 'bold' or child.tag == 'b':
                parts.append(f'<strong>{child.text or ""}</strong>')
            elif child.tag == 'italic' or child.tag == 'i':
                parts.append(f'<em>{child.text or ""}</em>')
            elif child.tag == 'sup':
                parts.append(f'<sup>{child.text or ""}</sup>')
            elif child.tag == 'sub':
                parts.append(f'<sub>{child.text or ""}</sub>')
            elif child.tag == 'xref':
                ref_type = child.get('ref-type', '')
                rid = child.get('rid', '')
                text = child.text or ''
                if ref_type == 'bibr':
                    parts.append(f'<a href="#ref-{rid}" class="citation-ref">{text}</a>')
                elif ref_type == 'fig':
                    parts.append(f'<a href="#fig-{rid}" class="figure-ref">{text}</a>')
                elif ref_type == 'table':
                    parts.append(f'<a href="#table-{rid}" class="table-ref">{text}</a>')
                else:
                    parts.append(text)
            elif child.tag == 'ext-link':
                href = child.get('{http://www.w3.org/1999/xlink}href', '#')
                text = child.text or href
                parts.append(f'<a href="{href}" target="_blank" rel="noopener">{text}</a>')
            else:
                # Default: just get text
                parts.append(etree.tostring(child, method='text', encoding='unicode'))
            
            if child.tail:
                parts.append(child.tail)
        
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
        """Parse a figure element into HTML."""
        fig_id = fig_elem.get('id', '')
        
        label = fig_elem.find('label')
        label_text = label.text if label is not None and label.text else ''
        
        caption = fig_elem.find('caption')
        caption_text = ''
        if caption is not None:
            for p in caption.findall('p'):
                caption_text += etree.tostring(p, method='text', encoding='unicode').strip() + ' '
            caption_text = caption_text.strip()
        
        graphic = fig_elem.find('.//graphic')
        graphic_href = ''
        if graphic is not None:
            graphic_href = graphic.get('{http://www.w3.org/1999/xlink}href', '')
        
        html = f'''<figure id="fig-{fig_id}" class="article-figure">
    <img src="{{{{FIGURE:{graphic_href}}}}}" alt="{label_text}" loading="lazy">
    <figcaption>
        <strong>{label_text}</strong> {caption_text}
    </figcaption>
</figure>'''
        return html
    
    def _parse_table_html(self, table_wrap) -> str:
        """Parse a table-wrap element into HTML."""
        table_id = table_wrap.get('id', '')
        
        label = table_wrap.find('label')
        label_text = label.text if label is not None and label.text else ''
        
        caption = table_wrap.find('caption')
        caption_text = ''
        if caption is not None:
            for p in caption.findall('p'):
                caption_text += etree.tostring(p, method='text', encoding='unicode').strip() + ' '
            caption_text = caption_text.strip()
        
        # Get the table content
        table = table_wrap.find('.//table')
        table_html = ''
        if table is not None:
            table_html = etree.tostring(table, method='html', encoding='unicode')
        
        html = f'''<div id="table-{table_id}" class="article-table">
    <div class="table-caption">
        <strong>{label_text}</strong> {caption_text}
    </div>
    <div class="table-content">
        {table_html}
    </div>
</div>'''
        return html
    
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
        """Extract all references."""
        references = []
        
        ref_list = self.root.find('.//ref-list')
        if ref_list is None:
            return references
        
        for ref in ref_list.findall('ref'):
            parsed_ref = ParsedReference()
            parsed_ref.ref_id = ref.get('id', '')
            
            label = ref.find('label')
            parsed_ref.label = label.text if label is not None and label.text else ''
            
            # Try different citation formats
            citation = ref.find('.//element-citation') or ref.find('.//mixed-citation')
            if citation is not None:
                # Authors
                authors = []
                for name in citation.findall('.//name'):
                    surname = name.find('surname')
                    given = name.find('given-names')
                    if surname is not None and surname.text:
                        author = surname.text
                        if given is not None and given.text:
                            author += f' {given.text[0]}'
                        authors.append(author)
                parsed_ref.authors = ', '.join(authors)
                
                # Title
                article_title = citation.find('article-title')
                if article_title is not None:
                    parsed_ref.title = etree.tostring(article_title, method='text', encoding='unicode').strip()
                
                # Source (journal name)
                source = citation.find('source')
                if source is not None and source.text:
                    parsed_ref.source = source.text.strip()
                
                # Year
                year = citation.find('year')
                if year is not None and year.text:
                    parsed_ref.year = year.text.strip()
                
                # Volume
                volume = citation.find('volume')
                if volume is not None and volume.text:
                    parsed_ref.volume = volume.text.strip()
                
                # Pages
                fpage = citation.find('fpage')
                lpage = citation.find('lpage')
                if fpage is not None and fpage.text:
                    parsed_ref.pages = fpage.text
                    if lpage is not None and lpage.text:
                        parsed_ref.pages += f'-{lpage.text}'
                
                # DOI
                doi = citation.find('.//pub-id[@pub-id-type="doi"]')
                if doi is not None and doi.text:
                    parsed_ref.doi = doi.text.strip()
            
            # Full citation text
            parsed_ref.full_citation = etree.tostring(ref, method='text', encoding='unicode').strip()
            
            references.append(parsed_ref)
        
        return references
    
    def _parse_references_html(self) -> str:
        """Parse references section into HTML."""
        ref_list = self.root.find('.//ref-list')
        if ref_list is None:
            return ''
        
        html_parts = ['<section class="references">', '<h2>References</h2>', '<ol class="reference-list">']
        
        for ref in ref_list.findall('ref'):
            ref_id = ref.get('id', '')
            label = ref.find('label')
            label_text = label.text if label is not None and label.text else ''
            
            # Get full citation text
            citation_text = etree.tostring(ref, method='text', encoding='unicode').strip()
            # Clean up the citation text
            citation_text = re.sub(r'^\d+\.?\s*', '', citation_text)  # Remove leading number
            
            html_parts.append(f'<li id="ref-{ref_id}" class="reference-item">{citation_text}</li>')
        
        html_parts.append('</ol>')
        html_parts.append('</section>')
        return '\n'.join(html_parts)
    
    def _parse_acknowledgments(self) -> str:
        """Parse acknowledgments section."""
        ack = self.root.find('.//ack')
        if ack is None:
            return ''
        
        html_parts = ['<section class="acknowledgments">', '<h2>Acknowledgments</h2>']
        
        for p in ack.findall('p'):
            p_text = etree.tostring(p, method='text', encoding='unicode').strip()
            html_parts.append(f'<p>{p_text}</p>')
        
        html_parts.append('</section>')
        return '\n'.join(html_parts)


class GenericXMLParser(BaseXMLParser):
    """
    Generic XML parser for non-JATS formats.
    
    Attempts to extract content from common XML patterns.
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
            result.body_html = self._find_body()
            
            result.success = True
            
        except Exception as e:
            logger.exception('Error parsing generic XML')
            result.errors.append(f'Parsing error: {str(e)}')
        
        result.errors.extend(self.errors)
        return result
    
    def _find_title(self) -> str:
        """Try to find article title."""
        for tag in ['title', 'article-title', 'Title', 'ArticleTitle']:
            elem = self.root.find(f'.//{tag}')
            if elem is not None:
                return etree.tostring(elem, method='text', encoding='unicode').strip()
        return ''
    
    def _find_abstract(self) -> str:
        """Try to find abstract."""
        for tag in ['abstract', 'Abstract', 'summary', 'Summary']:
            elem = self.root.find(f'.//{tag}')
            if elem is not None:
                return etree.tostring(elem, method='text', encoding='unicode').strip()
        return ''
    
    def _find_body(self) -> str:
        """Try to find body content."""
        for tag in ['body', 'Body', 'content', 'Content', 'text', 'Text']:
            elem = self.root.find(f'.//{tag}')
            if elem is not None:
                html = etree.tostring(elem, method='html', encoding='unicode')
                return f'<div class="article-body">{html}</div>'
        return ''


def detect_xml_format(xml_content: str) -> str:
    """
    Detect the format of an XML document.
    
    Returns: 'jats', 'generic', or 'unknown'
    """
    if not xml_content:
        return 'unknown'
    
    # Check for JATS indicators
    if '<article' in xml_content and ('dtd-version' in xml_content or 'article-type' in xml_content):
        return 'jats'
    
    if '<front>' in xml_content and '<body>' in xml_content:
        return 'jats'
    
    if 'JATS' in xml_content or 'jats' in xml_content:
        return 'jats'
    
    # Check if it looks like valid XML
    if xml_content.strip().startswith('<'):
        return 'generic'
    
    return 'unknown'


def parse_article_xml(xml_content: str) -> ParsedArticle:
    """
    Main entry point for parsing article XML.
    
    Automatically detects the XML format and uses the appropriate parser.
    """
    format_type = detect_xml_format(xml_content)
    
    if format_type == 'jats':
        parser = JATSParser(xml_content)
    elif format_type == 'generic':
        parser = GenericXMLParser(xml_content)
    else:
        result = ParsedArticle()
        result.errors.append('Unable to detect XML format')
        return result
    
    return parser.parse()










