"""Serializers for site settings and pages."""

from rest_framework import serializers
from .models import SiteSettings, Page


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer for site settings."""
    
    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'site_description', 'tagline',
            'logo', 'favicon',
            'contact_email', 'contact_phone', 'contact_address',
            'social_links',
            'footer_text', 'copyright_text',
            'meta_keywords', 'meta_description',
            'google_analytics_id',
            'updated_at'
        ]
        read_only_fields = ['updated_at']


class PageListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for page listings."""
    
    journal_slug = serializers.CharField(source='journal.slug', read_only=True)
    journal_title = serializers.CharField(source='journal.title', read_only=True)
    
    class Meta:
        model = Page
        fields = [
            'id', 'journal', 'journal_slug', 'journal_title',
            'title', 'slug', 'excerpt',
            'is_active', 'show_in_navigation', 'display_order'
        ]


class PageDetailSerializer(serializers.ModelSerializer):
    """Full serializer for page detail view."""
    
    journal_slug = serializers.CharField(source='journal.slug', read_only=True)
    journal_title = serializers.CharField(source='journal.title', read_only=True)
    
    class Meta:
        model = Page
        fields = [
            'id', 'journal', 'journal_slug', 'journal_title',
            'title', 'slug', 'content', 'excerpt',
            'is_active', 'show_in_navigation', 'display_order',
            'meta_title', 'meta_description',
            'template_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PageCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating pages."""
    
    class Meta:
        model = Page
        fields = [
            'id', 'journal', 'title', 'slug', 'content', 'excerpt',
            'is_active', 'show_in_navigation', 'display_order',
            'meta_title', 'meta_description',
            'template_name'
        ]
        read_only_fields = ['id']









