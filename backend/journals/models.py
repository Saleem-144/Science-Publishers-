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
        'About Journal',
        blank=True,
        help_text='Full description/About section of the journal (supports HTML)'
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
        db_index=True,
        help_text='Print ISSN (e.g., 1234-5678)'
    )
    issn_online = models.CharField(
        'ISSN (Online)',
        max_length=20,
        blank=True,
        db_index=True,
        help_text='Online ISSN (e.g., 1234-5678)'
    )
    
    # Branding
    cover_image = models.ImageField(
        upload_to='journals/covers/',
        blank=True,
        null=True,
        max_length=500,
        help_text='Journal cover image for display'
    )
    banner_image = models.ImageField(
        upload_to='journals/banners/',
        blank=True,
        null=True,
        max_length=500,
        help_text='Wide banner image for the journal homepage hero section'
    )
    logo = models.ImageField(
        upload_to='journals/logos/',
        blank=True,
        null=True,
        max_length=500,
        help_text='Journal logo'
    )
    favicon = models.ImageField(
        upload_to='journals/favicons/',
        blank=True,
        null=True,
        max_length=500,
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
    editor_in_chief_image = models.ImageField(
        'Editor-in-Chief Photo',
        upload_to='journals/editors/',
        blank=True,
        null=True,
        max_length=500,
        help_text='Photo of the Editor-in-Chief for avatar display'
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
    indexing = models.TextField(
        blank=True,
        help_text='Indexing information (can include HTML)'
    )
    open_thematic_issue = models.TextField(
        blank=True,
        help_text='Open thematic issue information (can include HTML)'
    )
    author_guidelines = models.TextField(
        blank=True,
        help_text='Guidelines for authors submitting manuscripts'
    )
    peer_review_policy = models.TextField(
        blank=True,
        help_text='Description of the peer review process'
    )
    
    # Actions & Files
    submission_url = models.URLField(
        'Submission URL',
        blank=True,
        help_text='URL for submitting work (e.g. OJS or external form)'
    )
    login_url = models.URLField(
        'Login URL',
        blank=True,
        help_text='URL for author login'
    )
    flyer_pdf = models.FileField(
        'Journal Flyer (PDF)',
        upload_to='journals/flyers/',
        blank=True,
        null=True,
        max_length=500,
        help_text='PDF flyer for the journal'
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
        return self.articles_direct.filter(status='published').count()


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
        max_length=500,
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
        max_length=500,
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


class EditorialBoardMember(models.Model):
    """
    Structured information for editorial board members.
    Grouped by designation on the frontend.
    """
    journal = models.ForeignKey(
        Journal,
        on_delete=models.CASCADE,
        related_name='editorial_board_members',
        help_text='The journal this member belongs to'
    )
    designation = models.CharField(
        max_length=200,
        help_text='Member role (e.g., Editor-in-Chief, Associate Editor)'
    )
    name = models.CharField(max_length=255)
    image = models.ImageField(
        upload_to='editorial_board/',
        blank=True,
        null=True,
        max_length=500,
        help_text='Member photo'
    )
    department = models.CharField(max_length=255, blank=True)
    institution = models.CharField(
        'School/College/University',
        max_length=255,
        blank=True
    )
    country = models.CharField(max_length=100, blank=True)
    description = models.TextField(
        blank=True,
        help_text='Brief bio or description (supports HTML/Rich Text)'
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order within the designation or overall'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'editorial board member'
        verbose_name_plural = 'editorial board members'
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.designation}) - {self.journal.title}"


class CTACard(models.Model):
    """
    Call to Action cards for the homepage hero section.
    Simplified version: only image and link.
    """
    image = models.ImageField(
        upload_to='cta_cards/',
        max_length=500,
        help_text='Image to display on the card'
    )
    link_url = models.URLField(
        'Link URL',
        default='#',
        help_text='URL to redirect when the card is clicked'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Show this card on the homepage?'
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order of appearance (lower numbers first)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'CTA card'
        verbose_name_plural = 'CTA cards'
        ordering = ['display_order', 'created_at']
    
    def __str__(self):
        return f"CTA Card {self.id} - {self.link_url}"


class JournalIndexing(models.Model):
    """
    Indexing entries for a journal (e.g. Scopus, PubMed).
    """
    journal = models.ForeignKey(
        Journal,
        on_delete=models.CASCADE,
        related_name='indexing_entries',
        help_text='The journal this indexing entry belongs to'
    )
    category = models.CharField(
        max_length=200,
        blank=True,
        help_text='Category/Heading for grouping (e.g. "Research Integrity & Quality Assurance")'
    )
    title = models.CharField(
        max_length=200,
        help_text='Name of the indexing service (e.g. Scopus)'
    )
    logo = models.ImageField(
        upload_to='journals/indexing_logos/',
        blank=True,
        null=True,
        max_length=500,
        help_text='Logo of the indexing service'
    )
    url = models.URLField(
        blank=True,
        help_text='Link to the journal listing on this indexing service'
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order of appearance'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'journal indexing'
        verbose_name_plural = 'journal indexings'
        ordering = ['display_order', 'title']

    def __str__(self):
        return f"{self.title} - {self.journal.title}"


class CTAButton(models.Model):
    """
    Customizable CTA buttons for the homepage hero section.
    """
    SLUG_CHOICES = [
        ('editorial-board', 'Become a Editorial Board Member'),
        ('reviewer', 'Become a Reviewer'),
        ('call-for-editors', 'Call For Editors'),
        ('section-editor', 'Become a section Editor'),
    ]
    
    slug = models.SlugField(max_length=50, choices=SLUG_CHOICES, unique=True)
    label = models.CharField(max_length=255)
    notification_email = models.EmailField(help_text="Form submissions will be sent to this email")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "CTA Button"
        verbose_name_plural = "CTA Buttons"
        
    def __str__(self):
        return self.label


class CTAFormSubmission(models.Model):
    """
    Submissions from the homepage CTA forms.
    """
    TITLE_CHOICES = [
        ('Mr.', 'Mr.'),
        ('Mrs.', 'Mrs.'),
        ('Ms.', 'Ms.'),
        ('Prof.', 'Prof.'),
        ('Dr.', 'Dr.'),
    ]
    
    button = models.ForeignKey(CTAButton, on_delete=models.CASCADE, related_name='submissions')
    title = models.CharField(max_length=10, choices=TITLE_CHOICES)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    qualification = models.CharField("Last Academic Qualification", max_length=255)
    affiliation = models.CharField(max_length=255)
    journal = models.ForeignKey(Journal, on_delete=models.SET_NULL, null=True, blank=True)
    country = models.CharField(max_length=100)
    expertise = models.CharField("Field of Expertise", max_length=255)
    orcid_id = models.CharField("ORCID ID", max_length=50, blank=True)
    scopus_id = models.CharField("Scopus ID", max_length=50, blank=True)
    cv_file = models.FileField("Upload CV", upload_to='cta_submissions/cvs/', max_length=500)
    comments = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "CTA Form Submission"
        verbose_name_plural = "CTA Form Submissions"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.button.label}"


class FAQ(models.Model):
    """
    Frequently Asked Questions for a specific journal.
    """
    journal = models.ForeignKey(
        Journal,
        on_delete=models.CASCADE,
        related_name='faqs',
        help_text='The journal this FAQ belongs to'
    )
    question = models.TextField(help_text='The question text')
    answer = models.TextField(help_text='The answer text (supports HTML)')
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order of appearance'
    )
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ['display_order', 'created_at']
        
    def __str__(self):
        return f"{self.question[:50]}... ({self.journal.title})"


class IndexingPlatform(models.Model):
    """
    Global indexing platforms (e.g. Scopus, Web of Science).
    """
    name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "indexing platform"
        verbose_name_plural = "indexing platforms"
        ordering = ['display_order', 'name']
        
    def __str__(self):
        return self.name


class JournalIndexingLink(models.Model):
    """
    Links a journal to a global indexing platform with a specific URL.
    """
    platform = models.ForeignKey(
        IndexingPlatform,
        on_delete=models.CASCADE,
        related_name='journal_links'
    )
    journal = models.ForeignKey(
        Journal,
        on_delete=models.CASCADE,
        related_name='global_indexing_links'
    )
    url = models.URLField(help_text='URL to the journal on this indexing platform')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "journal indexing link"
        verbose_name_plural = "journal indexing links"
        unique_together = ['platform', 'journal']
        
    def __str__(self):
        return f"{self.journal.title} on {self.platform.name}"
