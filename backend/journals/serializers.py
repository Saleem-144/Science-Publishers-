"""Serializers for journals app."""

import logging
from rest_framework import serializers
from .models import Subject, Journal, Announcement, CorporateAffiliation, EditorialBoardMember, CTACard, JournalIndexing, CTAButton, CTAFormSubmission


class JournalIndexingSerializer(serializers.ModelSerializer):
    """Serializer for Journal Indexing entries."""
    
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = JournalIndexing
        fields = [
            'id', 'journal', 'category', 'title', 'logo', 'logo_url', 'url', 'display_order'
        ]
        read_only_fields = ['id', 'logo_url']

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None


class CTAButtonSerializer(serializers.ModelSerializer):
    """Serializer for CTA Buttons."""
    class Meta:
        model = CTAButton
        fields = ['id', 'slug', 'label', 'notification_email', 'is_active']


class CTAFormSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for CTA Form Submissions."""
    class Meta:
        model = CTAFormSubmission
        fields = [
            'id', 'button', 'title', 'first_name', 'last_name', 
            'email', 'qualification', 'affiliation', 'journal', 
            'country', 'expertise', 'orcid_id', 'scopus_id', 
            'cv_file', 'comments', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class EditorialBoardMemberSerializer(serializers.ModelSerializer):
    """Serializer for Editorial Board Member."""
    
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = EditorialBoardMember
        fields = [
            'id', 'journal', 'designation', 'name', 
            'image', 'image_url', 'department', 
            'institution', 'country', 'description', 
            'display_order'
        ]
        read_only_fields = ['id', 'image_url']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CTACardSerializer(serializers.ModelSerializer):
    """Serializer for CTA Card listing."""
    
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CTACard
        fields = [
            'id', 'image', 'image_url', 'link_url', 
            'is_active', 'display_order', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'image_url', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CTACardCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating CTA Cards."""
    
    class Meta:
        model = CTACard
        fields = [
            'id', 'image', 'link_url', 'is_active', 'display_order'
        ]
        read_only_fields = ['id']


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for Subject model."""
    
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    journal_count = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    slug = serializers.SlugField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'slug', 'description',
            'parent', 'parent_name', 'children',
            'is_active', 'display_order',
            'journal_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_journal_count(self, obj):
        return obj.journals.filter(is_active=True).count()
    
    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        if children.exists():
            return SubjectListSerializer(children, many=True).data
        return []


class SubjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for subject listings."""
    
    journal_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'slug', 'journal_count']
    
    def get_journal_count(self, obj):
        return obj.journals.filter(is_active=True).count()


class JournalListSerializer(serializers.ModelSerializer):
    """Serializer for journal listings (lightweight)."""
    
    subjects = SubjectListSerializer(many=True, read_only=True)
    total_volumes = serializers.IntegerField(read_only=True)
    total_articles = serializers.IntegerField(read_only=True)
    editor_in_chief_image = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    
    class Meta:
        model = Journal
        fields = [
            'id', 'title', 'slug', 'short_title', 'short_description',
            'issn_print', 'issn_online',
            'cover_image', 'logo', 'primary_color',
            'editor_in_chief', 'editor_in_chief_image',
            'is_featured', 'is_active', 'subjects',
            'total_volumes', 'total_articles'
        ]

    def _get_absolute_url(self, field):
        if field:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(field.url)
            return field.url
        return None

    def get_editor_in_chief_image(self, obj):
        return self._get_absolute_url(obj.editor_in_chief_image)

    def get_cover_image(self, obj):
        return self._get_absolute_url(obj.cover_image)

    def get_logo(self, obj):
        return self._get_absolute_url(obj.logo)


class JournalDetailSerializer(serializers.ModelSerializer):
    """Full serializer for journal detail view."""
    
    subjects = SubjectListSerializer(many=True, read_only=True)
    subject_ids = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        many=True,
        write_only=True,
        source='subjects',
        required=False
    )
    current_issue = serializers.SerializerMethodField()
    editorial_board_members = serializers.SerializerMethodField()
    indexing_entries = serializers.SerializerMethodField()
    flyer_pdf = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    favicon = serializers.SerializerMethodField()
    editor_in_chief_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Journal
        fields = [
            'id', 'title', 'slug', 'short_title',
            'description', 'short_description',
            'issn_print', 'issn_online',
            'cover_image', 'logo', 'favicon',
            'primary_color', 'secondary_color',
            'editor_in_chief', 'editor_in_chief_image',
            'publisher', 'founding_year', 'frequency',
            'aims_and_scope', 'indexing', 'open_thematic_issue',
            'author_guidelines', 'peer_review_policy',
            'submission_url', 'flyer_pdf',
            'contact_email', 'website_url',
            'subjects', 'subject_ids',
            'is_active', 'is_featured',
            'meta_title', 'meta_description', 'meta_keywords',
            'total_volumes', 'total_articles', 'current_issue',
            'editorial_board_members', 'indexing_entries',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_volumes', 'total_articles']
    
    def _get_absolute_url(self, field):
        if field:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(field.url)
            return field.url
        return None

    def get_flyer_pdf(self, obj):
        return self._get_absolute_url(obj.flyer_pdf)

    def get_cover_image(self, obj):
        return self._get_absolute_url(obj.cover_image)

    def get_logo(self, obj):
        return self._get_absolute_url(obj.logo)

    def get_favicon(self, obj):
        return self._get_absolute_url(obj.favicon)

    def get_editor_in_chief_image(self, obj):
        return self._get_absolute_url(obj.editor_in_chief_image)

    def get_editorial_board_members(self, obj):
        members = obj.editorial_board_members.all().order_by('display_order', 'name')
        return EditorialBoardMemberSerializer(members, many=True, context=self.context).data
    
    def get_indexing_entries(self, obj):
        entries = obj.indexing_entries.all().order_by('display_order', 'title')
        return JournalIndexingSerializer(entries, many=True, context=self.context).data
    
    def get_current_issue(self, obj):
        try:
            current = obj.current_issue
            if current:
                return {
                    'id': current.id,
                    'issue_number': current.issue_number,
                    'volume_number': current.volume.volume_number if current.volume else None,
                    'year': current.volume.year if current.volume else None,
                    'title': current.title,
                    'publication_date': current.publication_date,
                }
            return None
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in get_current_issue for journal {obj.slug}: {str(e)}", exc_info=True)
            return None

class JournalCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating journals (admin)."""
    
    subject_ids = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        many=True,
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Journal
        fields = [
            'id', 'title', 'slug', 'short_title',
            'description', 'short_description',
            'issn_print', 'issn_online',
            'cover_image', 'logo', 'favicon',
            'primary_color', 'secondary_color',
            'editor_in_chief', 'editor_in_chief_image',
            'publisher', 'founding_year', 'frequency',
            'aims_and_scope', 'indexing', 'open_thematic_issue',
            'author_guidelines', 'peer_review_policy',
            'submission_url', 'flyer_pdf',
            'contact_email', 'website_url',
            'subject_ids',
            'is_active', 'is_featured',
            'meta_title', 'meta_description', 'meta_keywords',
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        subject_ids = validated_data.pop('subject_ids', [])
        journal = Journal.objects.create(**validated_data)
        if subject_ids:
            journal.subjects.set(subject_ids)
        return journal
    
    def update(self, instance, validated_data):
        subject_ids = validated_data.pop('subject_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if subject_ids is not None:
            instance.subjects.set(subject_ids)
        return instance


# =============================================================================
# Announcement Serializers
# =============================================================================

class AnnouncementListSerializer(serializers.ModelSerializer):
    """Serializer for announcement listings - includes content for editing."""
    
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'featured_image', 'author_name',
            'show_on_homepage', 'is_published',
            'published_at', 'created_at',
            'created_by', 'created_by_name'
        ]
    
    def get_created_by_name(self, obj):
        # If author_name is manually set, use that
        if obj.author_name:
            return obj.author_name
        # Otherwise, use the account name
        if obj.created_by:
            # Show "Administrator" for superusers/staff
            if obj.created_by.is_superuser or obj.created_by.is_staff:
                full_name = obj.created_by.get_full_name()
                if full_name:
                    return f"{full_name} (Administrator)"
                return "Administrator"
            # Return full name or email for regular users
            if obj.created_by.get_full_name():
                return obj.created_by.get_full_name()
            return obj.created_by.email
        return 'Unknown'


class AnnouncementDetailSerializer(serializers.ModelSerializer):
    """Full serializer for announcement detail view."""
    
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'featured_image', 'author_name',
            'show_on_homepage', 'is_published',
            'published_at', 'created_at', 'updated_at',
            'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        # If author_name is manually set, use that
        if obj.author_name:
            return obj.author_name
        # Otherwise, use the account name
        if obj.created_by:
            # Show "Administrator" for superusers/staff
            if obj.created_by.is_superuser or obj.created_by.is_staff:
                full_name = obj.created_by.get_full_name()
                if full_name:
                    return f"{full_name} (Administrator)"
                return "Administrator"
            # Return full name or email for regular users
            if obj.created_by.get_full_name():
                return obj.created_by.get_full_name()
            return obj.created_by.email
        return 'Unknown'


class AnnouncementCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating announcements (admin)."""
    
    created_by_name = serializers.SerializerMethodField(read_only=True)
    slug = serializers.SlugField(required=False, allow_blank=True, read_only=True)
    published_at = serializers.DateTimeField(required=False, allow_null=True, input_formats=['%Y-%m-%d', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'])
    is_published = serializers.BooleanField(required=False, default=False)
    show_on_homepage = serializers.BooleanField(required=False, default=False)
    featured_image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'featured_image', 'author_name',
            'show_on_homepage', 'is_published', 'published_at',
            'created_by', 'created_by_name'
        ]
        read_only_fields = ['id', 'slug', 'created_by', 'created_by_name']
    
    def to_internal_value(self, data):
        # Convert QueryDict to mutable dict
        if hasattr(data, 'dict'):
            data = data.dict()
        else:
            data = dict(data)
        
        # Handle string boolean values from form data
        if 'is_published' in data:
            val = data.get('is_published')
            if isinstance(val, str):
                data['is_published'] = val.lower() in ('true', '1', 'yes')
        if 'show_on_homepage' in data:
            val = data.get('show_on_homepage')
            if isinstance(val, str):
                data['show_on_homepage'] = val.lower() in ('true', '1', 'yes')
        
        # Handle date string - convert to datetime
        if 'published_at' in data:
            val = data.get('published_at')
            if val and isinstance(val, str) and len(val) == 10:  # Date only format like "2025-12-20"
                data['published_at'] = f"{val}T00:00:00"
        
        # Handle featured_image - remove if it's empty or invalid
        if 'featured_image' in data:
            img = data.get('featured_image')
            # If it's an empty string, None, or has zero size, remove it
            if not img:
                data.pop('featured_image', None)
            elif hasattr(img, 'size') and img.size == 0:
                data.pop('featured_image', None)
            elif hasattr(img, 'name') and not img.name:
                data.pop('featured_image', None)
        
        return super().to_internal_value(data)
    
    def validate_featured_image(self, value):
        """Validate featured_image - only JPG and PNG formats allowed."""
        if value is None:
            return value
        # If it's an empty file, return None
        if hasattr(value, 'size') and value.size == 0:
            return None
        
        # Check file extension - only JPG and PNG allowed
        if hasattr(value, 'name'):
            file_name = value.name.lower()
            allowed_extensions = ['.jpg', '.jpeg', '.png']
            file_ext = None
            for ext in allowed_extensions:
                if file_name.endswith(ext):
                    file_ext = ext
                    break
            
            if not file_ext:
                from rest_framework import serializers as drf_serializers
                raise drf_serializers.ValidationError(
                    "Only JPG and PNG image formats are allowed."
                )
        
        return value
    
    def get_created_by_name(self, obj):
        # If author_name is manually set, use that
        if obj.author_name:
            return obj.author_name
        # Otherwise, use the account name
        if obj.created_by:
            # Show "Administrator" for superusers/staff
            if obj.created_by.is_superuser or obj.created_by.is_staff:
                full_name = obj.created_by.get_full_name()
                if full_name:
                    return f"{full_name} (Administrator)"
                return "Administrator"
            # Return full name or email for regular users
            if obj.created_by.get_full_name():
                return obj.created_by.get_full_name()
            return obj.created_by.email
        return 'Unknown'


# =============================================================================
# Corporate Affiliation Serializers
# =============================================================================

class CorporateAffiliationSerializer(serializers.ModelSerializer):
    """Serializer for corporate affiliations."""
    
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CorporateAffiliation
        fields = [
            'id', 'name', 'logo', 'logo_url', 'url',
            'display_order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None


class CorporateAffiliationCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating corporate affiliations (admin)."""
    
    logo = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = CorporateAffiliation
        fields = [
            'id', 'name', 'logo', 'url',
            'display_order', 'is_active'
        ]
        read_only_fields = ['id']
    
    def validate_logo(self, value):
        """Validate logo - only JPG and PNG formats allowed."""
        if value is None:
            return value
        
        # Check file extension - only JPG and PNG allowed
        if hasattr(value, 'name'):
            file_name = value.name.lower()
            allowed_extensions = ['.jpg', '.jpeg', '.png']
            file_ext = None
            for ext in allowed_extensions:
                if file_name.endswith(ext):
                    file_ext = ext
                    break
            
            if not file_ext:
                raise serializers.ValidationError(
                    "Only JPG and PNG image formats are allowed."
                )
        
        return value



