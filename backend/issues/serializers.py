"""Serializers for issues app."""

from rest_framework import serializers
from .models import Issue


class IssueListSerializer(serializers.ModelSerializer):
    """Serializer for issue listings."""
    
    volume_number = serializers.IntegerField(source='volume.volume_number', read_only=True)
    year = serializers.IntegerField(source='volume.year', read_only=True)
    journal_title = serializers.CharField(source='volume.journal.title', read_only=True)
    journal_slug = serializers.CharField(source='volume.journal.slug', read_only=True)
    total_articles = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Issue
        fields = [
            'id', 'volume', 'volume_number', 'year',
            'journal_title', 'journal_slug',
            'issue_number', 'title', 'publication_date',
            'cover_image', 'is_special_issue', 'special_issue_title',
            'is_active', 'is_current',
            'total_articles', 'display_name', 'full_citation'
        ]


class IssueDetailSerializer(serializers.ModelSerializer):
    """Full serializer for issue detail view."""
    
    volume_number = serializers.IntegerField(source='volume.volume_number', read_only=True)
    year = serializers.IntegerField(source='volume.year', read_only=True)
    journal_id = serializers.IntegerField(source='volume.journal.id', read_only=True)
    journal_title = serializers.CharField(source='volume.journal.title', read_only=True)
    journal_slug = serializers.CharField(source='volume.journal.slug', read_only=True)
    total_articles = serializers.IntegerField(read_only=True)
    articles = serializers.SerializerMethodField()
    
    class Meta:
        model = Issue
        fields = [
            'id', 'volume', 'volume_number', 'year',
            'journal_id', 'journal_title', 'journal_slug',
            'issue_number', 'title', 'publication_date', 'description',
            'cover_image', 'is_special_issue', 'special_issue_title',
            'is_active', 'is_current',
            'total_articles', 'display_name', 'full_citation',
            'articles',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_articles(self, obj):
        from articles.serializers import ArticleListSerializer
        articles = obj.articles.filter(status='published').order_by('page_start', 'created_at')
        return ArticleListSerializer(articles, many=True).data


class IssueCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating issues."""
    
    class Meta:
        model = Issue
        fields = [
            'id', 'volume', 'issue_number', 'title',
            'publication_date', 'description', 'cover_image',
            'is_special_issue', 'special_issue_title',
            'is_active', 'is_current'
        ]
        read_only_fields = ['id']
    
    def validate(self, attrs):
        volume = attrs.get('volume', getattr(self.instance, 'volume', None))
        issue_number = attrs.get('issue_number', getattr(self.instance, 'issue_number', None))
        
        # Check for duplicate issue number in volume
        if volume and issue_number:
            existing = Issue.objects.filter(
                volume=volume,
                issue_number=issue_number
            )
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            if existing.exists():
                raise serializers.ValidationError({
                    'issue_number': f'Issue {issue_number} already exists in this volume.'
                })
        
        return attrs






















