"""Views for volumes app."""

from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Volume
from journals.models import Journal
from .serializers import (
    VolumeListSerializer, VolumeDetailSerializer,
    VolumeCreateUpdateSerializer,
)


# =============================================================================
# Public Views
# =============================================================================

class VolumeListView(generics.ListAPIView):
    """
    List all active volumes.
    
    GET /api/v1/volumes/
    
    Query params:
    - journal: Filter by journal ID
    """
    permission_classes = [AllowAny]
    serializer_class = VolumeListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['journal']
    ordering_fields = ['year', 'volume_number']
    ordering = ['-year', '-volume_number']
    
    def get_queryset(self):
        return Volume.objects.filter(is_active=True).select_related('journal')


class VolumeDetailView(generics.RetrieveAPIView):
    """
    Get volume details by ID.
    
    GET /api/v1/volumes/{id}/
    """
    permission_classes = [AllowAny]
    serializer_class = VolumeDetailSerializer
    
    def get_queryset(self):
        return Volume.objects.filter(is_active=True).select_related('journal')


class VolumesByJournalView(generics.ListAPIView):
    """
    List all volumes for a specific journal.
    
    GET /api/v1/volumes/by-journal/{journal_slug}/
    """
    permission_classes = [AllowAny]
    serializer_class = VolumeListSerializer
    
    def get_queryset(self):
        journal_slug = self.kwargs['journal_slug']
        journal = get_object_or_404(Journal, slug=journal_slug, is_active=True)
        return Volume.objects.filter(
            journal=journal,
            is_active=True
        ).order_by('-year', '-volume_number')


class VolumeByNumberView(generics.RetrieveAPIView):
    """
    Get volume by journal slug and volume number.
    
    GET /api/v1/volumes/by-journal/{journal_slug}/{volume_number}/
    """
    permission_classes = [AllowAny]
    serializer_class = VolumeDetailSerializer
    
    def get_object(self):
        journal_slug = self.kwargs['journal_slug']
        volume_number = self.kwargs['volume_number']
        journal = get_object_or_404(Journal, slug=journal_slug, is_active=True)
        return get_object_or_404(
            Volume,
            journal=journal,
            volume_number=volume_number,
            is_active=True
        )


# =============================================================================
# Admin Views
# =============================================================================

class VolumeAdminListView(generics.ListAPIView):
    """
    List all volumes (admin view).
    
    GET /api/v1/volumes/admin/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = VolumeListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['journal', 'is_active']
    ordering = ['-year', '-volume_number']
    
    def get_queryset(self):
        return Volume.objects.all().select_related('journal')


class VolumeCreateView(generics.CreateAPIView):
    """
    Create a new volume (admin only).
    
    POST /api/v1/volumes/admin/create/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = VolumeCreateUpdateSerializer


class VolumeAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete a volume (admin only).
    
    GET/PUT/PATCH/DELETE /api/v1/volumes/admin/{id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        return Volume.objects.all().select_related('journal')
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return VolumeCreateUpdateSerializer
        return VolumeDetailSerializer
