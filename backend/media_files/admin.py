"""Admin configuration for site settings and pages."""

from django.contrib import admin
from .models import SiteSettings, Page


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Admin configuration for SiteSettings model."""
    
    list_display = ('site_name', 'contact_email', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('site_name', 'site_description', 'tagline')
        }),
        ('Branding', {
            'fields': ('logo', 'favicon')
        }),
        ('Contact', {
            'fields': ('contact_email', 'contact_phone', 'contact_address')
        }),
        ('Social', {
            'fields': ('social_links',),
            'classes': ('collapse',)
        }),
        ('Footer', {
            'fields': ('footer_text', 'copyright_text')
        }),
        ('SEO', {
            'fields': ('meta_keywords', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Analytics', {
            'fields': ('google_analytics_id',),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion
        return False


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    """Admin configuration for Page model."""
    
    list_display = ('title', 'journal', 'slug', 'is_active', 'show_in_navigation', 'display_order')
    list_filter = ('is_active', 'show_in_navigation', 'journal')
    search_fields = ('title', 'content', 'slug')
    ordering = ('display_order', 'title')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('journal',)
    
    fieldsets = (
        ('Page Information', {
            'fields': ('journal', 'title', 'slug')
        }),
        ('Content', {
            'fields': ('content', 'excerpt')
        }),
        ('Display', {
            'fields': ('is_active', 'show_in_navigation', 'display_order')
        }),
        ('Template', {
            'fields': ('template_name',),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )
