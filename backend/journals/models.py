"""
Journal models - the top-level entity in the publishing hierarchy.

Each journal can have its own branding, configuration, and content.
URL pattern: /{journal_slug}/...
"""

from django.db import models
from django.utils.text import slugify


class Subject(models.Model):
    """
    Academic subject/category for organizing journals.
    Supports hierarchical structure with parent-child relationships.
    """
    
    name = models.CharField(
        max_length=200,
        help_text='Subject name (e.g., "Molecular Biology")'
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        help_text='URL-friendly version of the name'
    )
    description = models.TextField(
        blank=True,
        help_text='Description of this subject area'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children',
        help_text='Parent subject for hierarchical organization'
    )
    
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order in which to display this subject'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'subject'
        verbose_name_plural = 'subjects'
        ordering = ['display_order', 'name']
    
    def __str__(self):
        if self.parent:
            return f'{self.parent.name} > {self.name}'
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Journal(models.Model):
    """
    Academic journal - the primary content container.
    
    Each journal has its own:
    - Branding (logo, colors, cover image)
    - Metadata (ISSN, publisher, editorial info)
    - Content hierarchy (volumes → issues → articles)
    - URL namespace (/{slug}/...)
    """
    
    # Core identification
    title = models.CharField(
        max_length=500,
        help_text='Full journal title'
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        help_text='URL-friendly identifier (used in routes like /{slug}/)'
    )
    short_title = models.CharField(
        max_length=100,
        blank=True,
        help_text='Abbreviated journal title'
    )
    
    # Descriptions
    description = models.TextField(
        blank=True,
        help_text='Full description of the journal'
    )
    short_description = models.TextField(
        max_length=500,
        blank=True,
        help_text='Brief description for listings and cards'
    )
    
    # ISSN Numbers
    issn_print = models.CharField(
        'ISSN (Print)',
        max_length=20,
        blank=True,
        help_text='Print ISSN (e.g., 1234-5678)'
    )
    issn_online = models.CharField(
        'ISSN (Online)',
        max_length=20,
        blank=True,
        help_text='Online ISSN (e.g., 1234-5678)'
    )
    
    # Branding
    cover_image = models.ImageField(
        upload_to='journals/covers/',
        blank=True,
        null=True,
        help_text='Journal cover image for display'
    )
    logo = models.ImageField(
        upload_to='journals/logos/',
        blank=True,
        null=True,
        help_text='Journal logo'
    )
    favicon = models.ImageField(
        upload_to='journals/favicons/',
        blank=True,
        null=True,
        help_text='Favicon for browser tab'
    )
    primary_color = models.CharField(
        max_length=7,
        default='#1a365d',
        help_text='Primary brand color (hex code, e.g., #1a365d)'
    )
    secondary_color = models.CharField(
        max_length=7,
        default='#2b6cb0',
        help_text='Secondary brand color (hex code)'
    )
    
    # Editorial information
    editor_in_chief = models.CharField(
        max_length=200,
        blank=True,
        help_text='Name of the Editor-in-Chief'
    )
    publisher = models.CharField(
        max_length=200,
        blank=True,
        help_text='Publisher name'
    )
    founding_year = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text='Year the journal was founded'
    )
    frequency = models.CharField(
        max_length=100,
        blank=True,
        help_text='Publication frequency (e.g., "Quarterly", "Monthly")'
    )
    
    # Policy content
    aims_and_scope = models.TextField(
        blank=True,
        help_text='Journal aims and scope (can include HTML)'
    )
    author_guidelines = models.TextField(
        blank=True,
        help_text='Guidelines for authors submitting manuscripts'
    )
    peer_review_policy = models.TextField(
        blank=True,
        help_text='Description of the peer review process'
    )
    
    # Contact
    contact_email = models.EmailField(
        blank=True,
        help_text='Journal contact email'
    )
    website_url = models.URLField(
        blank=True,
        help_text='External website URL (if any)'
    )
    
    # Subject areas
    subjects = models.ManyToManyField(
        Subject,
        blank=True,
        related_name='journals',
        help_text='Subject areas this journal covers'
    )
    
    # Status
    is_active = models.BooleanField(
        default=True,
        help_text='Is this journal currently active?'
    )
    is_featured = models.BooleanField(
        default=False,
        help_text='Feature this journal on the homepage?'
    )
    
    # SEO
    meta_title = models.CharField(
        max_length=200,
        blank=True,
        help_text='SEO meta title (defaults to journal title)'
    )
    meta_description = models.TextField(
        max_length=500,
        blank=True,
        help_text='SEO meta description'
    )
    meta_keywords = models.CharField(
        max_length=500,
        blank=True,
        help_text='SEO keywords (comma-separated)'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'journal'
        verbose_name_plural = 'journals'
        ordering = ['title']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title
        super().save(*args, **kwargs)
    
    @property
    def current_issue(self):
        """Get the current (latest published) issue."""
        from issues.models import Issue
        return Issue.objects.filter(
            volume__journal=self,
            is_active=True,
            is_current=True
        ).first()
    
    @property
    def total_volumes(self):
        """Count of volumes in this journal."""
        return self.volumes.filter(is_active=True).count()
    
    @property
    def total_articles(self):
        """Count of published articles in this journal."""
        from articles.models import Article
        return Article.objects.filter(
            issue__volume__journal=self,
            status='published'
        ).count()


class CorporateAffiliation(models.Model):
    """
    Corporate affiliations/partners displayed on the homepage.
    """
    
    name = models.CharField(
        max_length=200,
        help_text='Organization name (e.g., "Crossref", "DOAJ")'
    )
    logo = models.ImageField(
        upload_to='affiliations/logos/',
        help_text='Logo image for the organization'
    )
    url = models.URLField(
        blank=True,
        help_text='Link to the organization website'
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order in which to display (lower numbers first)'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Show this affiliation on the site?'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'corporate affiliation'
        verbose_name_plural = 'corporate affiliations'
        ordering = ['display_order', 'name']
    
    def __str__(self):
        return self.name


class Announcement(models.Model):
    """
    News and announcements for the homepage and dedicated news pages.
    """
    
    title = models.CharField(
        max_length=300,
        help_text='Announcement headline'
    )
    slug = models.SlugField(
        max_length=300,
        unique=True,
        help_text='URL-friendly version of the title'
    )
    excerpt = models.TextField(
        max_length=500,
        help_text='Short summary for listing cards (2-3 lines)'
    )
    content = models.TextField(
        help_text='Full content of the announcement (can include HTML)'
    )
    
    # Images
    featured_image = models.ImageField(
        upload_to='announcements/images/',
        blank=True,
        null=True,
        help_text='Featured image for the announcement'
    )
    
    # Display settings
    show_on_homepage = models.BooleanField(
        default=False,
        help_text='Display this announcement on the homepage'
    )
    is_published = models.BooleanField(
        default=False,
        help_text='Is this announcement published?'
    )
    
    # Metadata - who created/uploaded this
    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='announcements',
        help_text='User who created this announcement'
    )
    author_name = models.CharField(
        max_length=200,
        blank=True,
        help_text='Author or source of the announcement'
    )
    
    # Timestamps
    published_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='Publication date (for ordering)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'announcement'
        verbose_name_plural = 'announcements'
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Announcement.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
