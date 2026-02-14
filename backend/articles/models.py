"""
Article models - the core content entities.

Articles are the primary content units containing research papers.
Hierarchy: Journal → Volume → Issue → Article

URL patterns:
- /{journal_slug}/article/{article_slug}
- /{journal_slug}/article/{article_slug}/abstract
- /{journal_slug}/article/{article_slug}/fulltext
- /{journal_slug}/article/{article_slug}/pdf
"""

from django.db import models
from django.utils.text import slugify
from django.utils.functional import cached_property
import uuid


class Author(models.Model):
    """
    Author entity - can be associated with multiple articles.
    
    Stored separately to allow reuse across articles and proper
    author disambiguation.
    """
    
    first_name = models.CharField(
        max_length=100,
        help_text='Author first/given name'
    )
    last_name = models.CharField(
        max_length=100,
        help_text='Author last/family name'
    )
    email = models.EmailField(
        blank=True,
        help_text='Author email address'
    )
    orcid_id = models.CharField(
        'ORCID ID',
        max_length=50,
        blank=True,
        help_text='ORCID identifier (e.g., 0000-0002-1825-0097)'
    )
    
    affiliation = models.TextField(
        blank=True,
        help_text='Primary institutional affiliation'
    )
    department = models.CharField(
        max_length=200,
        blank=True,
        help_text='Department or division'
    )
    country = models.CharField(
        max_length=100,
        blank=True,
        help_text='Country'
    )
    
    bio = models.TextField(
        blank=True,
        help_text='Short biography'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'author'
        verbose_name_plural = 'authors'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return self.full_name
    
    @property
    def full_name(self):
        """Full name in standard format."""
        return f'{self.first_name} {self.last_name}'
    
    @property
    def citation_name(self):
        """Name formatted for citations (Last, First Initial)."""
        first_initial = self.first_name[0] if self.first_name else ''
        return f'{self.last_name}, {first_initial}.'
    
    @property
    def article_count(self):
        """Number of articles by this author."""
        return self.article_authors.count()


class ArticleType(models.TextChoices):
    """Types of articles that can be published."""
    RESEARCH = 'research', 'Research Article'
    REVIEW = 'review', 'Review Article'
    CASE_REPORT = 'case_report', 'Case Report'
    SHORT_COMMUNICATION = 'short_communication', 'Short Communication'
    LETTER = 'letter', 'Letter to the Editor'
    EDITORIAL = 'editorial', 'Editorial'
    COMMENTARY = 'commentary', 'Commentary'
    PERSPECTIVE = 'perspective', 'Perspective'
    BOOK_REVIEW = 'book_review', 'Book Review'
    ERRATUM = 'erratum', 'Erratum'
    RETRACTION = 'retraction', 'Retraction'
    OTHER = 'other', 'Other'


class ArticleStatus(models.TextChoices):
    """Publication status of an article."""
    DRAFT = 'draft', 'Draft'
    PUBLISHED = 'published', 'Published'
    ARCHIVE = 'archive', 'Archive'


class Article(models.Model):
    """
    The primary content entity - a research article.
    
    Contains metadata, links to authors, files, and parsed HTML content.
    """
    
    # Relationships
    journal = models.ForeignKey(
        'journals.Journal',
        on_delete=models.CASCADE,
        related_name='articles_direct',
        null=True,
        blank=True,
        help_text='The journal this article belongs to (required)'
    )
    volume = models.ForeignKey(
        'volumes.Volume',
        on_delete=models.SET_NULL,
        related_name='articles',
        null=True,
        blank=True,
        help_text='The volume this article belongs to'
    )
    issue = models.ForeignKey(
        'issues.Issue',
        on_delete=models.SET_NULL,
        related_name='articles',
        null=True,
        blank=True,
        help_text='The issue this article belongs to'
    )
    
    # Core identification
    article_id_code = models.CharField(
        'Article ID',
        max_length=50,
        blank=True,
        db_index=True,
        help_text='Custom article identifier (e.g., JS-2024-001)'
    )
    title = models.TextField(
        help_text='Full article title'
    )
    slug = models.SlugField(
        max_length=300,
        db_index=True,
        help_text='URL-friendly identifier'
    )
    doi = models.CharField(
        'DOI',
        max_length=100,
        blank=True,
        db_index=True,
        help_text='Digital Object Identifier (e.g., 10.1000/xyz123)'
    )
    
    # Article type and status
    article_type = models.CharField(
        max_length=50,
        choices=ArticleType.choices,
        default=ArticleType.RESEARCH,
        help_text='Type of article'
    )
    status = models.CharField(
        max_length=20,
        choices=ArticleStatus.choices,
        default=ArticleStatus.DRAFT,
        help_text='Publication status'
    )
    is_special_issue = models.BooleanField(
        'Is Special Issue',
        default=False,
        help_text='Tick if this article belongs to a Special Issue'
    )
    is_preface = models.BooleanField(
        'Is Preface',
        default=False,
        help_text='Tick if this article is the preface/editorial for the volume'
    )
    
    # Content
    abstract = models.TextField(
        blank=True,
        help_text='Article abstract (plain text or simple HTML)'
    )
    keywords = models.JSONField(
        'SEO Keywords',
        default=list,
        blank=True,
        help_text='List of keywords for SEO as JSON array'
    )
    keywords_display = models.TextField(
        'Display Keywords',
        blank=True,
        help_text='Keywords to be displayed on the website'
    )
    license_text = models.TextField(
        'License',
        default='CC BY License',
        help_text='Licensing information (supports HTML for links)'
    )
    cite_as = models.TextField(
        'Cite As',
        blank=True,
        help_text='Custom citation text. If empty, a default citation will be generated.'
    )
    
    # Files
    xml_file = models.FileField(
        'XML File',
        upload_to='articles/xml/',
        blank=True,
        null=True,
        max_length=500,
        help_text='XML source file for parsing'
    )
    pdf_file = models.FileField(
        'PDF File',
        upload_to='articles/pdf/',
        blank=True,
        null=True,
        max_length=500
    )
    epub_file = models.FileField(
        'ePUB File',
        upload_to='articles/epub/',
        blank=True,
        null=True,
        max_length=500
    )
    prc_file = models.FileField(
        'PRC File',
        upload_to='articles/prc/',
        blank=True,
        null=True,
        max_length=500
    )
    mobi_file = models.FileField(
        'Mobi File',
        upload_to='articles/mobi/',
        blank=True,
        null=True,
        max_length=500
    )
    ris_file = models.FileField(
        'RIS Citation',
        upload_to='articles/citations/',
        blank=True,
        null=True,
        max_length=500,
        help_text='RIS citation file'
    )
    bib_file = models.FileField(
        'BibTeX Citation',
        upload_to='articles/citations/',
        blank=True,
        null=True,
        max_length=500,
        help_text='BibTeX citation file'
    )
    endnote_file = models.FileField(
        'EndNote Citation',
        upload_to='articles/citations/',
        blank=True,
        null=True,
        max_length=500,
        help_text='EndNote citation file'
    )
    
    # Page information
    page_start = models.CharField(
        max_length=20,
        blank=True,
        help_text='Starting page number'
    )
    page_end = models.CharField(
        max_length=20,
        blank=True,
        help_text='Ending page number'
    )
    article_number = models.CharField(
        max_length=50,
        blank=True,
        help_text='Article number (for journals using article numbers instead of pages)'
    )
    
    # Important dates
    received_date = models.DateField(
        null=True,
        blank=True,
        help_text='Date manuscript was received'
    )
    revised_date = models.DateField(
        null=True,
        blank=True,
        help_text='Date revised manuscript was received'
    )
    accepted_date = models.DateField(
        null=True,
        blank=True,
        help_text='Date manuscript was accepted'
    )
    published_date = models.DateField(
        null=True,
        blank=True,
        help_text='Date article was published online'
    )
    
    # Access and visibility
    is_open_access = models.BooleanField(
        default=True,
        help_text='Is this article open access?'
    )
    is_featured = models.BooleanField(
        default=False,
        help_text='Feature this article on the homepage?'
    )
    
    # Analytics
    view_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of times article has been viewed'
    )
    download_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of times PDF has been downloaded'
    )
    
    # Scores
    cite_score = models.CharField(
        max_length=50,
        blank=True,
        help_text='Cite Score value'
    )
    cite_score_url = models.URLField(
        blank=True,
        help_text='URL for Cite Score'
    )
    scopus_score = models.CharField(
        max_length=50,
        blank=True,
        help_text='Scopus Score value'
    )
    scopus_score_url = models.URLField(
        blank=True,
        help_text='URL for Scopus Score'
    )
    
    # Top highlights and Crossmark
    top_highlighted_line = models.TextField(
        blank=True,
        help_text='Red highlighted text shown at the very top of the article'
    )
    crossmark_logo = models.ImageField(
        upload_to='articles/logos/',
        blank=True,
        null=True,
        max_length=500,
        help_text='Crossmark or other top logo'
    )
    crossmark_url = models.URLField(
        blank=True,
        help_text='URL for the Crossmark/top logo'
    )
    
    # SEO
    meta_title = models.CharField(
        max_length=200,
        blank=True,
        help_text='SEO meta title'
    )
    meta_description = models.TextField(
        max_length=500,
        blank=True,
        help_text='SEO meta description'
    )
    
    # Authors (many-to-many through ArticleAuthor)
    authors = models.ManyToManyField(
        Author,
        through='ArticleAuthor',
        related_name='articles',
        help_text='Article authors'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'article'
        verbose_name_plural = 'articles'
        ordering = ['-published_date', '-created_at']
    
    def __str__(self):
        return self.title[:100]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate slug from title with UUID suffix for uniqueness
            base_slug = slugify(self.title[:250])
            self.slug = f'{base_slug}-{uuid.uuid4().hex[:8]}'
        if not self.meta_title:
            self.meta_title = self.title[:200]
        super().save(*args, **kwargs)
    
    @cached_property
    def get_journal(self):
        """Convenience accessor for the journal."""
        if self.journal:
            return self.journal
        if self.issue and self.issue.volume and self.issue.volume.journal:
            return self.issue.volume.journal
        if self.volume and self.volume.journal:
            return self.volume.journal
        return None
    
    @cached_property
    def get_volume(self):
        """Convenience accessor for the volume."""
        if self.volume:
            return self.volume
        if self.issue:
            return self.issue.volume
        return None
    
    @property
    def volume_number(self):
        """Get volume number from volume or issue."""
        vol = self.get_volume
        return vol.volume_number if vol else None

    @property
    def issue_number(self):
        """Get issue number if available."""
        return self.issue.issue_number if self.issue else None

    @property
    def year(self):
        """Get publication year. Prioritizes Volume year, then Published Date year."""
        vol = self.get_volume
        if vol and vol.year:
            return vol.year
        if self.published_date:
            return self.published_date.year
        return None

    @property
    def pages(self):
        """Page range as string."""
        if self.page_start and self.page_end:
            return f'{self.page_start}-{self.page_end}'
        elif self.page_start:
            return self.page_start
        elif self.article_number:
            return f'Article {self.article_number}'
        return ''
    
    @property
    def citation(self):
        """Generate a basic citation string."""
        author_list = self.get_author_list()
        year = self.published_date.year if self.published_date else ''
        journal_obj = self.get_journal
        journal_title = (journal_obj.short_title or journal_obj.title) if journal_obj else 'Unknown Journal'
        
        volume_info = ""
        volume_obj = self.get_volume
        if volume_obj:
            volume_info = f"{volume_obj.volume_number}"
            if self.issue:
                volume_info += f"({self.issue.issue_number})"
        
        return f'{author_list} ({year}). {self.title}. {journal_title}, {volume_info}, {self.pages}.'
    
    def get_author_list(self):
        """Get formatted author list for citations."""
        article_authors = self.article_authors.order_by('author_order')
        names = [aa.author.citation_name for aa in article_authors]
        if len(names) == 0:
            return ''
        elif len(names) == 1:
            return names[0]
        elif len(names) == 2:
            return f'{names[0]} & {names[1]}'
        else:
            return f'{names[0]} et al.'
    
    def get_corresponding_author(self):
        """Get the corresponding author if set."""
        corresponding = self.article_authors.filter(is_corresponding=True).first()
        return corresponding.author if corresponding else None
    
    def increment_view_count(self):
        """Increment the view count atomically."""
        Article.objects.filter(pk=self.pk).update(view_count=models.F('view_count') + 1)
    
    def increment_download_count(self):
        """Increment the download count atomically."""
        Article.objects.filter(pk=self.pk).update(download_count=models.F('download_count') + 1)


class ArticleAuthor(models.Model):
    """
    Through model for Article-Author relationship.
    
    Stores author order, corresponding author flag, and contribution info.
    """
    
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='article_authors'
    )
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE,
        related_name='article_authors'
    )
    
    author_order = models.PositiveIntegerField(
        default=1,
        help_text='Order of this author in the author list'
    )
    is_corresponding = models.BooleanField(
        default=False,
        help_text='Is this the corresponding author?'
    )
    author_contribution = models.TextField(
        blank=True,
        help_text='Description of author\'s contribution'
    )
    
    class Meta:
        verbose_name = 'article author'
        verbose_name_plural = 'article authors'
        ordering = ['author_order']
        unique_together = ['article', 'author']
    
    def __str__(self):
        return f'{self.author.full_name} - {self.article.title[:50]}'


class FileType(models.TextChoices):
    """Types of files that can be attached to articles."""
    XML = 'xml', 'XML Source'
    PDF = 'pdf', 'PDF'
    SUPPLEMENTARY = 'supplementary', 'Supplementary Material'
    DATA = 'data', 'Data File'


class ArticleFile(models.Model):
    """
    Files attached to an article (XML, PDF, supplementary materials).
    """
    
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='files'
    )
    
    file_type = models.CharField(
        max_length=20,
        choices=FileType.choices,
        help_text='Type of file'
    )
    file = models.FileField(
        upload_to='articles/files/',
        max_length=500,
        help_text='The uploaded file'
    )
    original_filename = models.CharField(
        max_length=255,
        blank=True,
        help_text='Original filename as uploaded'
    )
    file_size = models.PositiveIntegerField(
        default=0,
        help_text='File size in bytes'
    )
    mime_type = models.CharField(
        max_length=100,
        blank=True,
        help_text='MIME type of the file'
    )
    
    is_primary = models.BooleanField(
        default=False,
        help_text='Is this the primary file of its type?'
    )
    description = models.CharField(
        max_length=500,
        blank=True,
        help_text='Description of this file'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'article file'
        verbose_name_plural = 'article files'
        ordering = ['file_type', '-is_primary', 'created_at']
    
    def __str__(self):
        return f'{self.article.title[:50]} - {self.file_type}'
    
    def save(self, *args, **kwargs):
        # Store original filename if not set
        if not self.original_filename and self.file:
            self.original_filename = self.file.name.split('/')[-1]
        # Calculate file size
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)


class ParsingStatus(models.TextChoices):
    """Status of XML parsing."""
    PENDING = 'pending', 'Pending'
    PROCESSING = 'processing', 'Processing'
    SUCCESS = 'success', 'Success'
    FAILED = 'failed', 'Failed'


class ArticleHTMLContent(models.Model):
    """
    Stores parsed HTML content generated from XML.
    
    The XML parser extracts content and generates semantic HTML
    that is stored here for efficient rendering.
    """
    
    article = models.OneToOneField(
        Article,
        on_delete=models.CASCADE,
        related_name='html_content'
    )
    
    # Original XML storage
    original_xml = models.TextField(
        blank=True,
        help_text='Original XML content'
    )
    
    # Parsed HTML sections
    abstract_html = models.TextField(
        blank=True,
        help_text='Parsed abstract as HTML'
    )
    body_html = models.TextField(
        blank=True,
        help_text='Parsed article body as HTML'
    )
    references_html = models.TextField(
        blank=True,
        help_text='Parsed references section as HTML'
    )
    acknowledgments_html = models.TextField(
        blank=True,
        help_text='Parsed acknowledgments as HTML'
    )
    
    # Metadata extracted from XML
    figures_json = models.JSONField(
        default=list,
        blank=True,
        help_text='Metadata about figures extracted from XML'
    )
    tables_json = models.JSONField(
        default=list,
        blank=True,
        help_text='Metadata about tables extracted from XML'
    )
    
    # Parsing status
    parsing_status = models.CharField(
        max_length=20,
        choices=ParsingStatus.choices,
        default=ParsingStatus.PENDING,
        help_text='Status of XML parsing'
    )
    parsing_errors = models.TextField(
        blank=True,
        help_text='Error messages from parsing (if any)'
    )
    parsed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When the XML was last parsed'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'article HTML content'
        verbose_name_plural = 'article HTML contents'
    
    def __str__(self):
        return f'HTML Content for: {self.article.title[:50]}'

    def get_resolved_body_html(self, request=None):
        """Resolve figure references in body HTML on the fly."""
        return self._resolve_refs(self.body_html, request)

    def get_resolved_abstract_html(self, request=None):
        """Resolve figure references in abstract HTML on the fly."""
        return self._resolve_refs(self.abstract_html, request)

    def _resolve_refs(self, html, request=None):
        import re
        if not html:
            return html
            
        figures = self.article.figures.all()
        figure_map = {}
        
        # Determine base URL for relative paths
        base_url = ""
        if request:
            base_url = request.build_absolute_uri('/')[:-1]
        elif hasattr(settings, 'BACKEND_URL'):
            base_url = settings.BACKEND_URL.rstrip('/')
        else:
            base_url = "http://127.0.0.1:8000" # Fallback for local dev

        for fig in figures:
            if fig.image:
                url = fig.image.url
                if not url.startswith('http'):
                    url = f"{base_url}{url}"
                    
                filename = fig.original_filename or fig.image.name.split('/')[-1]
                figure_map[filename] = url
                
                # Also map without extension
                base_name = filename.rsplit('.', 1)[0] if '.' in filename else filename
                figure_map[base_name] = url
                
                if fig.figure_id:
                    figure_map[fig.figure_id] = url
                    figure_map[f"fig-{fig.figure_id}"] = url
                    # Also handle case-insensitive
                    figure_map[fig.figure_id.lower()] = url
                    figure_map[f"fig-{fig.figure_id.lower()}"] = url

        def replace_placeholder(match):
            ref = match.group(1).strip()
            # Try original, lowercase, and clean versions
            clean_ref = ref.split('/')[-1] if '/' in ref else ref
            search_keys = [ref, ref.lower(), clean_ref, clean_ref.lower()]
            
            for key in search_keys:
                if key in figure_map:
                    return figure_map[key]
            
            # Try removing 'fig-' prefix
            for key in search_keys:
                if key.startswith('fig-') and key[4:] in figure_map:
                    return figure_map[key[4:]]
                
            # Try adding 'fig-' prefix
            for key in search_keys:
                if not key.startswith('fig-') and f"fig-{key}" in figure_map:
                    return figure_map[f"fig-{key}"]

            # Try partial matches as last resort
            for key, url in figure_map.items():
                if clean_ref.lower() in key.lower() or key.lower() in clean_ref.lower():
                    return url
            
            return f"{base_url}/media/placeholder.png"
            
        return re.sub(r'\{\{FIGURE:([^}]+)\}\}', replace_placeholder, html)


class Figure(models.Model):
    """
    Figures extracted from articles.
    
    Stores image files and metadata for proper rendering.
    """
    
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='figures'
    )
    
    figure_id = models.CharField(
        max_length=100,
        blank=True,
        help_text='Figure ID from XML (e.g., "fig1")'
    )
    figure_number = models.PositiveIntegerField(
        default=1,
        help_text='Figure number for display'
    )
    label = models.CharField(
        max_length=100,
        blank=True,
        help_text='Figure label (e.g., "Figure 1")'
    )
    caption = models.TextField(
        blank=True,
        help_text='Figure caption'
    )
    
    image = models.ImageField(
        upload_to='articles/figures/',
        max_length=500,
        help_text='Figure image file'
    )
    original_filename = models.CharField(
        max_length=255,
        blank=True,
        help_text='Original image filename'
    )
    
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order for display in article'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'figure'
        verbose_name_plural = 'figures'
        ordering = ['display_order', 'figure_number']
    
    def __str__(self):
        return f'{self.label or f"Figure {self.figure_number}"} - {self.article.title[:30]}'


class Table(models.Model):
    """
    Tables extracted from articles.
    
    Stores table HTML and metadata.
    """
    
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='tables'
    )
    
    table_id = models.CharField(
        max_length=100,
        blank=True,
        help_text='Table ID from XML (e.g., "tbl1")'
    )
    table_number = models.PositiveIntegerField(
        default=1,
        help_text='Table number for display'
    )
    label = models.CharField(
        max_length=100,
        blank=True,
        help_text='Table label (e.g., "Table 1")'
    )
    caption = models.TextField(
        blank=True,
        help_text='Table caption'
    )
    
    table_html = models.TextField(
        blank=True,
        help_text='Table content as HTML'
    )
    
    footnotes = models.TextField(
        blank=True,
        help_text='Table footnotes'
    )
    
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order for display in article'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'table'
        verbose_name_plural = 'tables'
        ordering = ['display_order', 'table_number']
    
    def __str__(self):
        return f'{self.label or f"Table {self.table_number}"} - {self.article.title[:30]}'
