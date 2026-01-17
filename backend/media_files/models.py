"""
Site-wide settings and static pages models.

Handles:
- Global site configuration
- CMS-managed static pages (About, Contact, etc.)
"""

from django.db import models
from django.utils.text import slugify


class SiteSettings(models.Model):
    """
    Singleton model for site-wide settings.
    
    Stores global configuration that applies across all journals.
    """
    
    # Basic info
    site_name = models.CharField(
        max_length=200,
        default='Academic Journals Platform',
        help_text='Name of the publishing platform'
    )
    site_description = models.TextField(
        blank=True,
        help_text='Brief description of the platform'
    )
    tagline = models.CharField(
        max_length=300,
        blank=True,
        help_text='Site tagline or slogan'
    )
    
    # Branding
    logo = models.ImageField(
        upload_to='site/branding/',
        blank=True,
        null=True,
        help_text='Site logo'
    )
    favicon = models.ImageField(
        upload_to='site/branding/',
        blank=True,
        null=True,
        help_text='Site favicon'
    )
    
    # Contact information
    contact_email = models.EmailField(
        blank=True,
        help_text='Primary contact email'
    )
    contact_address = models.TextField(
        blank=True,
        help_text='Physical address'
    )
    contact_phone = models.CharField(
        max_length=50,
        blank=True,
        help_text='Contact phone number'
    )
    
    # Social links (stored as JSON)
    social_links = models.JSONField(
        default=dict,
        blank=True,
        help_text='Social media links as JSON object'
    )
    
    # Footer
    footer_text = models.TextField(
        blank=True,
        help_text='Footer text (can include HTML)'
    )
    copyright_text = models.CharField(
        max_length=200,
        blank=True,
        help_text='Copyright notice'
    )
    
    # SEO
    meta_keywords = models.CharField(
        max_length=500,
        blank=True,
        help_text='Default meta keywords'
    )
    meta_description = models.TextField(
        max_length=500,
        blank=True,
        help_text='Default meta description'
    )
    
    # Analytics
    google_analytics_id = models.CharField(
        max_length=50,
        blank=True,
        help_text='Google Analytics tracking ID'
    )
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'site settings'
        verbose_name_plural = 'site settings'
    
    def __str__(self):
        return self.site_name
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create the site settings instance."""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class Page(models.Model):
    """
    CMS-managed static pages.
    
    Can be global (About, Contact) or journal-specific.
    """
    
    # Optional journal association
    journal = models.ForeignKey(
        'journals.Journal',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='pages',
        help_text='If set, this page belongs to a specific journal'
    )
    
    title = models.CharField(
        max_length=200,
        help_text='Page title'
    )
    slug = models.SlugField(
        max_length=200,
        help_text='URL-friendly page identifier'
    )
    
    content = models.TextField(
        blank=True,
        help_text='Page content (HTML supported)'
    )
    excerpt = models.TextField(
        max_length=500,
        blank=True,
        help_text='Short excerpt for previews'
    )
    
    # Display settings
    is_active = models.BooleanField(
        default=True,
        help_text='Is this page published?'
    )
    show_in_navigation = models.BooleanField(
        default=True,
        help_text='Show this page in navigation menus?'
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text='Order in navigation'
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
    
    # Template override
    template_name = models.CharField(
        max_length=100,
        blank=True,
        help_text='Optional custom template name'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'page'
        verbose_name_plural = 'pages'
        ordering = ['display_order', 'title']
        unique_together = ['journal', 'slug']
    
    def __str__(self):
        if self.journal:
            return f'{self.journal.short_title or self.journal.title} - {self.title}'
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title
        super().save(*args, **kwargs)
