"""Admin configuration for volumes app."""

from django.contrib import admin
from .models import Volume


@admin.register(Volume)
class VolumeAdmin(admin.ModelAdmin):
    """Admin configuration for Volume model."""
    
    list_display = ('__str__', 'journal', 'volume_number', 'year', 'is_active', 'total_issues')
    list_filter = ('journal', 'year', 'is_active')
    search_fields = ('journal__title', 'title', 'description')
    ordering = ('-year', '-volume_number')
    raw_id_fields = ('journal',)
    
    fieldsets = (
        ('Journal', {
            'fields': ('journal',)
        }),
        ('Volume Information', {
            'fields': ('volume_number', 'year', 'title', 'description')
        }),
        ('Display', {
            'fields': ('cover_image', 'is_active')
        }),
    )
