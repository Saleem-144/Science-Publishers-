"""Serializers for volumes app."""

from rest_framework import serializers
from .models import Volume


class VolumeListSerializer(serializers.ModelSerializer):
    """Serializer for volume listings."""
    
    journal_title = serializers.CharField(source='journal.title', read_only=True)
    journal_slug = serializers.CharField(source='journal.slug', read_only=True)
    total_issues = serializers.IntegerField(read_only=True)
    total_articles = serializers.IntegerField(read_only=True)
    issues = serializers.SerializerMethodField()
    
    class Meta:
        model = Volume
        fields = [
            'id', 'journal', 'journal_title', 'journal_slug',
            'volume_number', 'title', 'year',
            'cover_image', 'is_active',
            'total_issues', 'total_articles',
            'display_name', 'issues'
        ]

    def get_issues(self, obj):
        from issues.serializers import IssueListSerializer
        issues = obj.issues.all().order_by('-issue_number')
        # If not admin, only show active
        request = self.context.get('request')
        if not (request and request.user and request.user.is_staff):
            issues = issues.filter(is_active=True)
        return IssueListSerializer(issues, many=True).data


class VolumeDetailSerializer(serializers.ModelSerializer):
    """Full serializer for volume detail view."""
    
    journal_title = serializers.CharField(source='journal.title', read_only=True)
    journal_slug = serializers.CharField(source='journal.slug', read_only=True)
    total_issues = serializers.IntegerField(read_only=True)
    total_articles = serializers.IntegerField(read_only=True)
    issues = serializers.SerializerMethodField()
    articles = serializers.SerializerMethodField()
    
    class Meta:
        model = Volume
        fields = [
            'id', 'journal', 'journal_title', 'journal_slug',
            'volume_number', 'title', 'year', 'description',
            'cover_image', 'is_active',
            'total_issues', 'total_articles',
            'display_name', 'issues', 'articles',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_issues(self, obj):
        from issues.serializers import IssueListSerializer
        issues = obj.issues.all().order_by('-issue_number')
        # If not admin, only show active
        request = self.context.get('request')
        if not (request and request.user and request.user.is_staff):
            issues = issues.filter(is_active=True)
        return IssueListSerializer(issues, many=True).data

    def get_articles(self, obj):
        from articles.serializers import ArticleListSerializer
        # Get articles linked directly to volume (like prefaces)
        articles = obj.articles.all().order_by('is_preface', 'page_start', 'created_at')
        # If not admin, only show published/archive
        request = self.context.get('request')
        if not (request and request.user and request.user.is_staff):
            articles = articles.filter(status__in=['published', 'archive'])
        return ArticleListSerializer(articles, many=True).data


class VolumeCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating volumes."""
    
    class Meta:
        model = Volume
        fields = [
            'id', 'journal', 'volume_number', 'title', 'year',
            'description', 'cover_image', 'is_active'
        ]
        read_only_fields = ['id']
    
    def validate(self, attrs):
        journal = attrs.get('journal', getattr(self.instance, 'journal', None))
        volume_number = attrs.get('volume_number', getattr(self.instance, 'volume_number', None))
        
        # Check for duplicate volume number in journal
        if journal and volume_number:
            existing = Volume.objects.filter(
                journal=journal,
                volume_number=volume_number
            )
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            if existing.exists():
                raise serializers.ValidationError({
                    'volume_number': f'Volume {volume_number} already exists in this journal.'
                })
        
        return attrs






















