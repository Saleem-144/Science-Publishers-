"""Views for journals app."""

from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Subject, Journal, Announcement, CorporateAffiliation
from .serializers import (
    SubjectSerializer,
    SubjectListSerializer,
    JournalListSerializer,
    JournalDetailSerializer,
    JournalCreateUpdateSerializer,
    AnnouncementListSerializer,
    AnnouncementDetailSerializer,
    AnnouncementCreateUpdateSerializer,
    CorporateAffiliationSerializer,
    CorporateAffiliationCreateUpdateSerializer,
)


# =============================================================================
# Public Journal Views
# =============================================================================

class JournalListView(generics.ListAPIView):
    """List all active journals."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_featured', 'subjects']
    ordering_fields = ['title', 'created_at']
    ordering = ['title']
    
    def get_queryset(self):
        return Journal.objects.filter(is_active=True)


class FeaturedJournalsView(generics.ListAPIView):
    """List featured journals for homepage."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalListSerializer
    
    def get_queryset(self):
        return Journal.objects.filter(is_active=True, is_featured=True)


class JournalSearchView(generics.ListAPIView):
    """Search journals by title, description, or keywords."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalListSerializer
    
    def get_queryset(self):
        queryset = Journal.objects.filter(is_active=True)
        query = self.request.query_params.get('q', '')
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(short_title__icontains=query) |
                Q(description__icontains=query) |
                Q(short_description__icontains=query) |
                Q(meta_keywords__icontains=query)
            )
        
        return queryset


class JournalBySlugView(generics.RetrieveAPIView):
    """Get journal by slug."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Journal.objects.filter(is_active=True)


class JournalDetailView(generics.RetrieveAPIView):
    """Get journal by ID."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalDetailSerializer
    
    def get_queryset(self):
        return Journal.objects.filter(is_active=True)


# =============================================================================
# Public Subject Views
# =============================================================================

class SubjectListView(generics.ListAPIView):
    """List all active subjects."""
    
    permission_classes = [AllowAny]
    serializer_class = SubjectSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name', 'display_order']
    ordering = ['display_order', 'name']
    
    def get_queryset(self):
        # Only return top-level subjects (no parent)
        return Subject.objects.filter(is_active=True, parent__isnull=True)


class SubjectDetailView(generics.RetrieveAPIView):
    """Get subject by slug."""
    
    permission_classes = [AllowAny]
    serializer_class = SubjectSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Subject.objects.filter(is_active=True)


class JournalsBySubjectView(generics.ListAPIView):
    """Get journals by subject slug."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalListSerializer
    
    def get_queryset(self):
        slug = self.kwargs.get('slug')
        return Journal.objects.filter(
            is_active=True,
            subjects__slug=slug
        ).distinct()


# =============================================================================
# Admin Journal Views
# =============================================================================

class JournalAdminListView(generics.ListAPIView):
    """Admin: List all journals (including inactive)."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_featured']
    search_fields = ['title', 'short_title', 'description']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        return Journal.objects.all()


class JournalCreateView(generics.CreateAPIView):
    """Admin: Create a new journal."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalCreateUpdateSerializer
    queryset = Journal.objects.all()


class JournalAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete a journal."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Journal.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return JournalCreateUpdateSerializer
        return JournalDetailSerializer


# =============================================================================
# Admin Subject Views
# =============================================================================

class SubjectAdminListView(generics.ListAPIView):
    """Admin: List all subjects (including inactive)."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'display_order', 'created_at']
    ordering = ['display_order', 'name']
    
    def get_queryset(self):
        return Subject.objects.all()


class SubjectCreateView(generics.CreateAPIView):
    """Admin: Create a new subject."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all()


class SubjectAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete a subject."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all()


# =============================================================================
# Public Announcement Views
# =============================================================================

class AnnouncementListView(generics.ListAPIView):
    """List all published announcements."""
    
    permission_classes = [AllowAny]
    serializer_class = AnnouncementListSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['published_at', 'created_at']
    ordering = ['-published_at', '-created_at']
    
    def get_queryset(self):
        return Announcement.objects.filter(is_published=True)


class HomepageAnnouncementsView(generics.ListAPIView):
    """List announcements for homepage (always 5 most recent published news)."""
    
    permission_classes = [AllowAny]
    serializer_class = AnnouncementListSerializer
    
    def get_queryset(self):
        # Always show the 5 most recent published announcements
        # Newest replaces oldest automatically
        return Announcement.objects.filter(
            is_published=True
        ).order_by('-published_at', '-created_at')[:5]


class AnnouncementBySlugView(generics.RetrieveAPIView):
    """Get announcement by slug."""
    
    permission_classes = [AllowAny]
    serializer_class = AnnouncementDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Announcement.objects.filter(is_published=True)


class AnnouncementDetailView(generics.RetrieveAPIView):
    """Get announcement by ID."""
    
    permission_classes = [AllowAny]
    serializer_class = AnnouncementDetailSerializer
    
    def get_queryset(self):
        return Announcement.objects.filter(is_published=True)


# =============================================================================
# Admin Announcement Views
# =============================================================================

class AnnouncementAdminListView(generics.ListAPIView):
    """Admin: List all announcements (including unpublished)."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AnnouncementListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_published', 'show_on_homepage']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['title', 'published_at', 'created_at', 'updated_at']
    ordering = ['-published_at', '-created_at']
    pagination_class = None  # Return all results without pagination
    
    def get_queryset(self):
        return Announcement.objects.all()


class AnnouncementCreateView(generics.CreateAPIView):
    """Admin: Create a new announcement."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AnnouncementCreateUpdateSerializer
    queryset = Announcement.objects.all()
    
    def perform_create(self, serializer):
        # Automatically set the created_by to the logged-in user
        serializer.save(created_by=self.request.user)


class AnnouncementAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete an announcement."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Announcement.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AnnouncementCreateUpdateSerializer
        return AnnouncementDetailSerializer
    
    def update(self, request, *args, **kwargs):
        # Debug: Print incoming data
        print("=" * 50)
        print("UPDATE REQUEST DEBUG")
        print(f"Content-Type: {request.content_type}")
        print(f"Method: {request.method}")
        print(f"Data keys: {list(request.data.keys())}")
        for key, value in request.data.items():
            if key != 'featured_image':
                print(f"  {key}: {value} (type: {type(value).__name__})")
            else:
                print(f"  {key}: <File>")
        print("=" * 50)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            print("=" * 50)
            print(f"VALIDATION ERRORS: {serializer.errors}")
            print("=" * 50)
            return Response(serializer.errors, status=400)
        
        serializer.save()
        return Response(serializer.data)


# =============================================================================
# Public Corporate Affiliation Views
# =============================================================================

class CorporateAffiliationListView(generics.ListAPIView):
    """List all active corporate affiliations for homepage."""
    
    permission_classes = [AllowAny]
    serializer_class = CorporateAffiliationSerializer
    
    def get_queryset(self):
        return CorporateAffiliation.objects.filter(is_active=True).order_by('display_order', 'name')


# =============================================================================
# Admin Corporate Affiliation Views
# =============================================================================

class CorporateAffiliationAdminListView(generics.ListAPIView):
    """Admin: List all corporate affiliations."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CorporateAffiliationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'url']
    ordering_fields = ['name', 'display_order', 'created_at']
    ordering = ['display_order', 'name']
    
    def get_queryset(self):
        return CorporateAffiliation.objects.all()


class CorporateAffiliationCreateView(generics.CreateAPIView):
    """Admin: Create a new corporate affiliation."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CorporateAffiliationCreateUpdateSerializer
    queryset = CorporateAffiliation.objects.all()


class CorporateAffiliationAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete a corporate affiliation."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = CorporateAffiliation.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CorporateAffiliationCreateUpdateSerializer
        return CorporateAffiliationSerializer
