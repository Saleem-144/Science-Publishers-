"""Views for issues app."""

from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Issue
from journals.models import Journal
from volumes.models import Volume
from .serializers import (
    IssueListSerializer, IssueDetailSerializer,
    IssueCreateUpdateSerializer,
)


# =============================================================================
# Public Views
# =============================================================================

class IssueListView(generics.ListAPIView):
    """
    List all active issues.
    
    GET /api/v1/issues/
    
    Query params:
    - volume: Filter by volume ID
    - journal: Filter by journal ID (across all volumes)
    """
    permission_classes = [AllowAny]
    serializer_class = IssueListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['volume']
    ordering = ['-publication_date', '-issue_number']
    
    def get_queryset(self):
        queryset = Issue.objects.filter(is_active=True).select_related('volume__journal')
        
        # Filter by journal (across all volumes)
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            queryset = queryset.filter(volume__journal_id=journal_id)
        
        return queryset


class IssueDetailView(generics.RetrieveAPIView):
    """
    Get issue details by ID.
    
    GET /api/v1/issues/{id}/
    """
    permission_classes = [AllowAny]
    serializer_class = IssueDetailSerializer
    
    def get_queryset(self):
        return Issue.objects.filter(is_active=True).select_related('volume__journal')


class IssuesByVolumeView(generics.ListAPIView):
    """
    List all issues in a specific volume.
    
    GET /api/v1/issues/by-volume/{volume_id}/
    """
    permission_classes = [AllowAny]
    serializer_class = IssueListSerializer
    
    def get_queryset(self):
        volume_id = self.kwargs['volume_id']
        return Issue.objects.filter(
            volume_id=volume_id,
            is_active=True
        ).order_by('-issue_number')


class CurrentIssueView(generics.RetrieveAPIView):
    """
    Get the current issue for a journal.
    
    GET /api/v1/issues/by-journal/{journal_slug}/current/
    """
    permission_classes = [AllowAny]
    serializer_class = IssueDetailSerializer
    
    def get_object(self):
        journal_slug = self.kwargs['journal_slug']
        journal = get_object_or_404(Journal, slug=journal_slug, is_active=True)
        
        # First try to get explicitly marked current issue
        issue = Issue.objects.filter(
            volume__journal=journal,
            is_active=True,
            is_current=True
        ).first()
        
        # If no current issue marked, get the latest one
        if not issue:
            issue = Issue.objects.filter(
                volume__journal=journal,
                is_active=True
            ).order_by('-publication_date', '-volume__year', '-volume__volume_number', '-issue_number').first()
        
        if not issue:
            from rest_framework.exceptions import NotFound
            raise NotFound('No issues found for this journal.')
        
        return issue


class IssueByNumberView(generics.RetrieveAPIView):
    """
    Get issue by journal slug and issue number.
    
    Note: This gets the issue by issue_number within the journal.
    For multi-volume journals, you might need to specify volume too.
    
    GET /api/v1/issues/by-journal/{journal_slug}/{issue_number}/
    """
    permission_classes = [AllowAny]
    serializer_class = IssueDetailSerializer
    
    def get_object(self):
        journal_slug = self.kwargs['journal_slug']
        issue_number = self.kwargs['issue_number']
        journal = get_object_or_404(Journal, slug=journal_slug, is_active=True)
        
        # Get the most recent issue with this number
        issue = Issue.objects.filter(
            volume__journal=journal,
            issue_number=issue_number,
            is_active=True
        ).order_by('-volume__year', '-volume__volume_number').first()
        
        if not issue:
            from rest_framework.exceptions import NotFound
            raise NotFound(f'Issue {issue_number} not found.')
        
        return issue


# =============================================================================
# Admin Views
# =============================================================================

class IssueAdminListView(generics.ListAPIView):
    """
    List all issues (admin view).
    
    GET /api/v1/issues/admin/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = IssueListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['volume', 'is_active', 'is_current']
    ordering = ['-volume__year', '-volume__volume_number', '-issue_number']
    
    def get_queryset(self):
        queryset = Issue.objects.all().select_related('volume__journal')
        
        # Filter by journal
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            queryset = queryset.filter(volume__journal_id=journal_id)
        
        return queryset


class IssueCreateView(generics.CreateAPIView):
    """
    Create a new issue (admin only).
    
    POST /api/v1/issues/admin/create/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = IssueCreateUpdateSerializer


class IssueAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete an issue (admin only).
    
    GET/PUT/PATCH/DELETE /api/v1/issues/admin/{id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        return Issue.objects.all().select_related('volume__journal')
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return IssueCreateUpdateSerializer
        return IssueDetailSerializer
