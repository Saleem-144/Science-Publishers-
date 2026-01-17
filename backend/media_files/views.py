"""Views for site settings and pages."""

from rest_framework import generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import SiteSettings, Page
from .serializers import (
    SiteSettingsSerializer,
    PageListSerializer, PageDetailSerializer, PageCreateUpdateSerializer
)


# =============================================================================
# Site Settings
# =============================================================================

class SiteSettingsView(APIView):
    """
    Get or update site settings.
    
    GET /api/v1/site/settings/
    PUT/PATCH /api/v1/site/settings/
    """
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]
    
    def get(self, request):
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings)
        return Response(serializer.data)
    
    def put(self, request):
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def patch(self, request):
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# =============================================================================
# Public Page Views
# =============================================================================

class PageListView(generics.ListAPIView):
    """
    List all active pages.
    
    GET /api/v1/site/pages/
    
    Query params:
    - journal: Filter by journal ID (null for global pages)
    - nav: If 'true', only show pages in navigation
    """
    permission_classes = [AllowAny]
    serializer_class = PageListSerializer
    pagination_class = None
    
    def get_queryset(self):
        queryset = Page.objects.filter(is_active=True)
        
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            if journal_id == 'global':
                queryset = queryset.filter(journal__isnull=True)
            else:
                queryset = queryset.filter(journal_id=journal_id)
        
        nav_only = self.request.query_params.get('nav')
        if nav_only and nav_only.lower() == 'true':
            queryset = queryset.filter(show_in_navigation=True)
        
        return queryset.order_by('display_order', 'title')


class PageDetailView(generics.RetrieveAPIView):
    """
    Get page by slug.
    
    GET /api/v1/site/pages/{slug}/
    
    Query params:
    - journal: Filter by journal slug (for journal-specific pages)
    """
    permission_classes = [AllowAny]
    serializer_class = PageDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = Page.objects.filter(is_active=True)
        
        journal_slug = self.request.query_params.get('journal')
        if journal_slug:
            queryset = queryset.filter(journal__slug=journal_slug)
        else:
            # Default to global pages
            queryset = queryset.filter(journal__isnull=True)
        
        return queryset


# =============================================================================
# Admin Page Views
# =============================================================================

class PageAdminListView(generics.ListAPIView):
    """
    List all pages (admin view).
    
    GET /api/v1/site/admin/pages/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = PageListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['journal', 'is_active']
    search_fields = ['title', 'content']
    queryset = Page.objects.all().order_by('display_order', 'title')


class PageCreateView(generics.CreateAPIView):
    """
    Create a new page (admin only).
    
    POST /api/v1/site/admin/pages/create/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = PageCreateUpdateSerializer


class PageAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete a page (admin only).
    
    GET/PUT/PATCH/DELETE /api/v1/site/admin/pages/{id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Page.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PageCreateUpdateSerializer
        return PageDetailSerializer


# =============================================================================
# Dashboard Statistics
# =============================================================================

class DashboardStatsView(APIView):
    """
    Get dashboard statistics for admin.
    
    GET /api/v1/site/admin/stats/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        from journals.models import Journal
        from volumes.models import Volume
        from issues.models import Issue
        from articles.models import Article, Author
        
        return Response({
            'total_journals': Journal.objects.count(),
            'active_journals': Journal.objects.filter(is_active=True).count(),
            'total_volumes': Volume.objects.count(),
            'total_issues': Issue.objects.count(),
            'total_articles': Article.objects.count(),
            'published_articles': Article.objects.filter(status='published').count(),
            'draft_articles': Article.objects.filter(status='draft').count(),
            'total_authors': Author.objects.count(),
            'featured_journals': Journal.objects.filter(is_featured=True).count(),
            'featured_articles': Article.objects.filter(is_featured=True).count(),
        })
