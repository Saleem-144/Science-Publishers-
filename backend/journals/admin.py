"""Admin configuration for journals app."""

from django.contrib import admin
from .models import Subject, Journal


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    """Admin configuration for Subject model."""
    
    list_display = ('name', 'parent', 'is_active', 'display_order', 'journal_count')
    list_filter = ('is_active', 'parent')
    search_fields = ('name', 'description')
    ordering = ('display_order', 'name')
    prepopulated_fields = {'slug': ('name',)}
    
    def journal_count(self, obj):
        return obj.journals.count()
    journal_count.short_description = 'Journals'


@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    """Admin configuration for Journal model."""
    
    list_display = ('title', 'slug', 'issn_print', 'issn_online', 'is_active', 'is_featured', 'total_volumes')
    list_filter = ('is_active', 'is_featured', 'subjects')
    search_fields = ('title', 'short_title', 'description', 'issn_print', 'issn_online')
    ordering = ('title',)
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('subjects',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'short_title', 'description', 'short_description')
        }),
        ('ISSN', {
            'fields': ('issn_print', 'issn_online')
        }),
        ('Branding', {
            'fields': ('cover_image', 'logo', 'favicon', 'primary_color', 'secondary_color')
        }),
        ('Editorial', {
            'fields': ('editor_in_chief', 'publisher', 'founding_year', 'frequency')
        }),
        ('Policies', {
            'fields': ('aims_and_scope', 'author_guidelines', 'peer_review_policy'),
            'classes': ('collapse',)
        }),
        ('Contact', {
            'fields': ('contact_email', 'website_url')
        }),
        ('Subjects', {
            'fields': ('subjects',)
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )
