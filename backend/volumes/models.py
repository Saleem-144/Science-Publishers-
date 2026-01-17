"""
Volume model - second level in the publishing hierarchy.

Journals contain Volumes, which contain Issues.
URL pattern: /{journal_slug}/volume/{volume_number}
"""

from django.db import models


class Volume(models.Model):
    """
    A volume represents a yearly or periodic collection of issues.
    
    Hierarchy: Journal → Volume → Issue → Article
    """
    
    journal = models.ForeignKey(
        'journals.Journal',
        on_delete=models.CASCADE,
        related_name='volumes',
        help_text='The journal this volume belongs to'
    )
    
    volume_number = models.PositiveIntegerField(
        help_text='Volume number (e.g., 1, 2, 3...)'
    )
    title = models.CharField(
        max_length=300,
        blank=True,
        help_text='Optional volume title (e.g., "Special Anniversary Volume")'
    )
    year = models.PositiveIntegerField(
        help_text='Publication year for this volume'
    )
    
    description = models.TextField(
        blank=True,
        help_text='Description or notes about this volume'
    )
    cover_image = models.ImageField(
        upload_to='volumes/covers/',
        blank=True,
        null=True,
        help_text='Volume cover image'
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text='Is this volume visible to the public?'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'volume'
        verbose_name_plural = 'volumes'
        ordering = ['-year', '-volume_number']
        unique_together = ['journal', 'volume_number']
    
    def __str__(self):
        if self.title:
            return f'{self.journal.short_title or self.journal.title} - Vol. {self.volume_number}: {self.title}'
        return f'{self.journal.short_title or self.journal.title} - Volume {self.volume_number} ({self.year})'
    
    @property
    def display_name(self):
        """Human-readable volume name."""
        return f'Volume {self.volume_number} ({self.year})'
    
    @property
    def total_issues(self):
        """Count of issues in this volume."""
        return self.issues.filter(is_active=True).count()
    
    @property
    def total_articles(self):
        """Count of articles across all issues in this volume."""
        from articles.models import Article
        return Article.objects.filter(
            issue__volume=self,
            status='published'
        ).count()
