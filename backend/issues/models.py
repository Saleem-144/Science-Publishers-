"""
Issue model - third level in the publishing hierarchy.

Volumes contain Issues, which contain Articles.
URL pattern: /{journal_slug}/issue/{issue_number}
"""

from django.db import models


class Issue(models.Model):
    """
    An issue represents a specific publication within a volume.
    
    Hierarchy: Journal → Volume → Issue → Article
    """
    
    volume = models.ForeignKey(
        'volumes.Volume',
        on_delete=models.CASCADE,
        related_name='issues',
        help_text='The volume this issue belongs to'
    )
    
    issue_number = models.PositiveIntegerField(
        help_text='Issue number within the volume (e.g., 1, 2, 3...)'
    )
    title = models.CharField(
        max_length=300,
        blank=True,
        help_text='Optional issue title (e.g., "Special Issue on Climate Change")'
    )
    
    publication_date = models.DateField(
        null=True,
        blank=True,
        help_text='Date this issue was published'
    )
    
    description = models.TextField(
        blank=True,
        help_text='Description or editorial note for this issue'
    )
    cover_image = models.ImageField(
        upload_to='issues/covers/',
        blank=True,
        null=True,
        help_text='Issue cover image'
    )
    
    # Special issue handling
    is_special_issue = models.BooleanField(
        default=False,
        help_text='Is this a special themed issue?'
    )
    special_issue_title = models.CharField(
        max_length=300,
        blank=True,
        help_text='Title for special issues (e.g., "Focus on Renewable Energy")'
    )
    
    # Status
    is_active = models.BooleanField(
        default=True,
        help_text='Is this issue visible to the public?'
    )
    is_current = models.BooleanField(
        default=False,
        help_text='Is this the current/latest issue? (for homepage display)'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'issue'
        verbose_name_plural = 'issues'
        ordering = ['-volume__year', '-volume__volume_number', '-issue_number']
        unique_together = ['volume', 'issue_number']
    
    def __str__(self):
        journal = self.volume.journal
        if self.is_special_issue and self.special_issue_title:
            return f'{journal.short_title or journal.title} - Vol. {self.volume.volume_number}, Issue {self.issue_number}: {self.special_issue_title}'
        return f'{journal.short_title or journal.title} - Vol. {self.volume.volume_number}, Issue {self.issue_number}'
    
    def save(self, *args, **kwargs):
        # If this issue is marked as current, unset current flag on other issues of same journal
        if self.is_current:
            Issue.objects.filter(
                volume__journal=self.volume.journal,
                is_current=True
            ).exclude(pk=self.pk).update(is_current=False)
        super().save(*args, **kwargs)
    
    @property
    def journal(self):
        """Convenience accessor for the journal."""
        return self.volume.journal
    
    @property
    def display_name(self):
        """Human-readable issue name."""
        if self.is_special_issue and self.special_issue_title:
            return f'Issue {self.issue_number}: {self.special_issue_title}'
        return f'Issue {self.issue_number}'
    
    @property
    def full_citation(self):
        """Full citation format: Volume X, Issue Y (Year)."""
        return f'Volume {self.volume.volume_number}, Issue {self.issue_number} ({self.volume.year})'
    
    @property
    def total_articles(self):
        """Count of published articles in this issue."""
        return self.articles.filter(status='published').count()
