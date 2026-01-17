"""Serializers for volumes app."""

from rest_framework import serializers
from .models import Volume


class VolumeListSerializer(serializers.ModelSerializer):
    """Serializer for volume listings."""
    
    journal_title = serializers.CharField(source='journal.title', read_only=True)
    journal_slug = serializers.CharField(source='journal.slug', read_only=True)
    total_issues = serializers.IntegerField(read_only=True)
    total_articles = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Volume
        fields = [
            'id', 'journal', 'journal_title', 'journal_slug',
            'volume_number', 'title', 'year',
            'cover_image', 'is_active',
            'total_issues', 'total_articles',
            'display_name'
        ]


class VolumeDetailSerializer(serializers.ModelSerializer):
    """Full serializer for volume detail view."""
    
    journal_title = serializers.CharField(source='journal.title', read_only=True)
    journal_slug = serializers.CharField(source='journal.slug', read_only=True)
    total_issues = serializers.IntegerField(read_only=True)
    total_articles = serializers.IntegerField(read_only=True)
    issues = serializers.SerializerMethodField()
    
    class Meta:
        model = Volume
        fields = [
            'id', 'journal', 'journal_title', 'journal_slug',
            'volume_number', 'title', 'year', 'description',
            'cover_image', 'is_active',
            'total_issues', 'total_articles',
            'display_name', 'issues',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_issues(self, obj):
        from issues.serializers import IssueListSerializer
        issues = obj.issues.filter(is_active=True).order_by('-issue_number')
        return IssueListSerializer(issues, many=True).data


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







