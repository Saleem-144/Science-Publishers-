"""Admin configuration for articles app."""

from django.contrib import admin
from .models import (
    Author, Article, ArticleAuthor, ArticleFile,
    ArticleHTMLContent, Figure, Table
)


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    """Admin configuration for Author model."""
    
    list_display = ('full_name', 'email', 'affiliation', 'country', 'article_count')
    list_filter = ('country',)
    search_fields = ('first_name', 'last_name', 'email', 'affiliation', 'orcid_id')
    ordering = ('last_name', 'first_name')
    
    fieldsets = (
        ('Name', {
            'fields': ('first_name', 'last_name')
        }),
        ('Contact', {
            'fields': ('email', 'orcid_id')
        }),
        ('Affiliation', {
            'fields': ('affiliation', 'department', 'country')
        }),
        ('Biography', {
            'fields': ('bio',),
            'classes': ('collapse',)
        }),
    )


class ArticleAuthorInline(admin.TabularInline):
    """Inline for managing article authors."""
    model = ArticleAuthor
    extra = 1
    raw_id_fields = ('author',)
    ordering = ('author_order',)


class ArticleFileInline(admin.TabularInline):
    """Inline for managing article files."""
    model = ArticleFile
    extra = 0
    readonly_fields = ('file_size', 'mime_type')


class FigureInline(admin.TabularInline):
    """Inline for managing figures."""
    model = Figure
    extra = 0


class TableInline(admin.TabularInline):
    """Inline for managing tables."""
    model = Table
    extra = 0


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    """Admin configuration for Article model."""
    
    list_display = ('title', 'issue', 'article_type', 'status', 'published_date', 'is_open_access', 'view_count')
    list_filter = ('status', 'article_type', 'is_open_access', 'is_featured', 'issue__volume__journal')
    search_fields = ('title', 'abstract', 'doi', 'keywords')
    ordering = ('-published_date', '-created_at')
    raw_id_fields = ('issue',)
    date_hierarchy = 'published_date'
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('view_count', 'download_count', 'created_at', 'updated_at')
    
    inlines = [ArticleAuthorInline, ArticleFileInline, FigureInline, TableInline]
    
    fieldsets = (
        ('Issue', {
            'fields': ('issue',)
        }),
        ('Article Information', {
            'fields': ('title', 'slug', 'doi', 'article_type')
        }),
        ('Content', {
            'fields': ('abstract', 'keywords')
        }),
        ('Pages', {
            'fields': ('page_start', 'page_end', 'article_number')
        }),
        ('Dates', {
            'fields': ('received_date', 'revised_date', 'accepted_date', 'published_date')
        }),
        ('Status', {
            'fields': ('status', 'is_open_access', 'is_featured')
        }),
        ('Analytics', {
            'fields': ('view_count', 'download_count'),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ArticleHTMLContent)
class ArticleHTMLContentAdmin(admin.ModelAdmin):
    """Admin configuration for ArticleHTMLContent model."""
    
    list_display = ('article', 'parsing_status', 'parsed_at', 'updated_at')
    list_filter = ('parsing_status',)
    search_fields = ('article__title',)
    raw_id_fields = ('article',)
    readonly_fields = ('parsed_at', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Article', {
            'fields': ('article',)
        }),
        ('XML Source', {
            'fields': ('original_xml',),
            'classes': ('collapse',)
        }),
        ('Parsed Content', {
            'fields': ('abstract_html', 'body_html', 'references_html', 'acknowledgments_html'),
            'classes': ('collapse',)
        }),
        ('Extracted Data', {
            'fields': ('figures_json', 'tables_json'),
            'classes': ('collapse',)
        }),
        ('Parsing Status', {
            'fields': ('parsing_status', 'parsing_errors', 'parsed_at')
        }),
    )
