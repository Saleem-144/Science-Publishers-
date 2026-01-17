"""Admin configuration for issues app."""

from django.contrib import admin
from .models import Issue


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    """Admin configuration for Issue model."""
    
    list_display = ('__str__', 'volume', 'issue_number', 'publication_date', 'is_active', 'is_current', 'total_articles')
    list_filter = ('volume__journal', 'is_active', 'is_current', 'is_special_issue', 'publication_date')
    search_fields = ('volume__journal__title', 'title', 'special_issue_title', 'description')
    ordering = ('-volume__year', '-volume__volume_number', '-issue_number')
    raw_id_fields = ('volume',)
    date_hierarchy = 'publication_date'
    
    fieldsets = (
        ('Volume', {
            'fields': ('volume',)
        }),
        ('Issue Information', {
            'fields': ('issue_number', 'title', 'publication_date', 'description')
        }),
        ('Special Issue', {
            'fields': ('is_special_issue', 'special_issue_title'),
            'classes': ('collapse',)
        }),
        ('Display', {
            'fields': ('cover_image', 'is_active', 'is_current')
        }),
    )
