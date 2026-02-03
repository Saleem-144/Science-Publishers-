from django.contrib import admin
from .models import Subject, Journal, CorporateAffiliation, Announcement, CTACard, EditorialBoardMember, JournalIndexing

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'display_order', 'is_active')
    list_filter = ('is_active', 'parent')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('display_order', 'name')


class EditorialBoardMemberInline(admin.TabularInline):
    model = EditorialBoardMember
    extra = 1
    fields = ('designation', 'name', 'institution', 'display_order')


@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'issn_print', 'issn_online', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured', 'subjects')
    search_fields = ('title', 'short_title', 'description', 'issn_print', 'issn_online')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('subjects',)
    inlines = [EditorialBoardMemberInline]
    
    fieldsets = (
        ('Core Identification', {
            'fields': (('title', 'slug'), 'short_title', ('issn_print', 'issn_online'))
        }),
        ('Journal Content', {
            'fields': ('description', 'short_description')
        }),
        ('Branding', {
            'fields': (('cover_image', 'logo', 'favicon'), ('primary_color', 'secondary_color'))
        }),
        ('Editorial', {
            'fields': (('editor_in_chief', 'publisher'), ('founding_year', 'frequency'))
        }),
        ('Policies', {
            'fields': ('aims_and_scope', 'indexing', 'open_thematic_issue', 'author_guidelines', 'peer_review_policy')
        }),
        ('Actions & Files', {
            'fields': ('submission_url', 'flyer_pdf')
        }),
        ('Contact & Web', {
            'fields': (('contact_email', 'website_url'), 'subjects')
        }),
        ('Status & SEO', {
            'fields': (('is_active', 'is_featured'), 'meta_title', 'meta_description', 'meta_keywords')
        }),
    )


@admin.register(CorporateAffiliation)
class CorporateAffiliationAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'display_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'url')
    ordering = ('display_order', 'name')


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'published_at', 'is_published', 'show_on_homepage', 'created_by')
    list_filter = ('is_published', 'show_on_homepage', 'created_at')
    search_fields = ('title', 'excerpt', 'content')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('created_by',)
    ordering = ('-published_at', '-created_at')


@admin.register(CTACard)
class CTACardAdmin(admin.ModelAdmin):
    list_display = ('id', 'link_url', 'display_order', 'is_active')
    list_filter = ('is_active',)
    ordering = ('display_order', 'created_at')


@admin.register(EditorialBoardMember)
class EditorialBoardMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'journal', 'display_order')
    list_filter = ('journal', 'designation')
    search_fields = ('name', 'designation', 'institution', 'description')
    ordering = ('journal', 'display_order', 'name')


@admin.register(JournalIndexing)
class JournalIndexingAdmin(admin.ModelAdmin):
    list_display = ('title', 'journal', 'url', 'display_order')
    list_filter = ('journal',)
    search_fields = ('title', 'url')
    ordering = ('journal', 'display_order', 'title')
