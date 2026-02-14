"""Views for journals app."""

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.cache import cache_control
from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, OuterRef, Subquery

from .models import (
    Subject, Journal, Announcement, CorporateAffiliation, 
    CTACard, EditorialBoardMember, JournalIndexing, 
    CTAButton, CTAFormSubmission, FAQ,
    IndexingPlatform, JournalIndexingLink
)
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
    CTACardSerializer,
    CTACardCreateUpdateSerializer,
    EditorialBoardMemberSerializer,
    JournalIndexingSerializer,
    CTAButtonSerializer,
    CTAFormSubmissionSerializer,
    FAQSerializer,
    IndexingPlatformSerializer,
    JournalIndexingLinkSerializer,
    IndexingPlatformDetailSerializer
)


# =============================================================================
# Indexing Journal Views
# =============================================================================

class IndexingPlatformListView(generics.ListAPIView):
    """Public: List all active indexing platforms with their linked journals."""
    permission_classes = [AllowAny]
    serializer_class = IndexingPlatformDetailSerializer
    pagination_class = None
    
    def get_queryset(self):
        return IndexingPlatform.objects.filter(is_active=True).prefetch_related(
            'journal_links', 'journal_links__journal'
        ).order_by('display_order', 'name')


class IndexingPlatformAdminListView(generics.ListAPIView):
    """Admin: List all indexing platforms."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = IndexingPlatformSerializer
    queryset = IndexingPlatform.objects.all().order_by('display_order', 'name')
    pagination_class = None


class IndexingPlatformCreateView(generics.CreateAPIView):
    """Admin: Create an indexing platform."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = IndexingPlatformSerializer


class IndexingPlatformAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete an indexing platform."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = IndexingPlatformSerializer
    queryset = IndexingPlatform.objects.all()


class JournalIndexingLinkAdminListView(generics.ListAPIView):
    """Admin: List all links for a platform or journal."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalIndexingLinkSerializer
    
    def get_queryset(self):
        platform_id = self.request.query_params.get('platform')
        journal_id = self.request.query_params.get('journal')
        queryset = JournalIndexingLink.objects.all()
        if platform_id:
            queryset = queryset.filter(platform_id=platform_id)
        if journal_id:
            queryset = queryset.filter(journal_id=journal_id)
        return queryset


class JournalIndexingLinkCreateView(generics.CreateAPIView):
    """Admin: Create a journal indexing link."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalIndexingLinkSerializer


class JournalIndexingLinkAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete a journal indexing link."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalIndexingLinkSerializer
    queryset = JournalIndexingLink.objects.all()

# =============================================================================
# Public Journal Views
# =============================================================================

class JournalListView(generics.ListAPIView):
    """List all active journals."""
    
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    @method_decorator(cache_control(max_age=300, public=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    permission_classes = [AllowAny]
    serializer_class = JournalListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'is_featured': ['exact'],
        'subjects': ['exact'],
        'issn_online': ['exact', 'icontains'],
        'issn_print': ['exact', 'icontains'],
    }
    search_fields = ['title', 'short_title', 'description', 'issn_online', 'issn_print']
    ordering_fields = ['title', 'created_at']
    ordering = ['title']
    
    def get_queryset(self):
        queryset = Journal.objects.filter(is_active=True).prefetch_related('subjects')
        
        # Custom filtering for subject slug if provided in params
        subject_slug = self.request.query_params.get('subjects__slug')
        if subject_slug:
            # Filter by subject slug, including journals in sub-subjects
            try:
                subject = Subject.objects.get(slug=subject_slug)
                # Get all descendant subject IDs (1 level deep for now as per current structure)
                subject_ids = [subject.id] + list(subject.children.values_list('id', flat=True))
                queryset = queryset.filter(subjects__id__in=subject_ids).distinct()
            except Subject.DoesNotExist:
                queryset = queryset.none()
        
        # Generic ISSN filter (checks both online and print)
        issn = self.request.query_params.get('issn')
        if issn:
            queryset = queryset.filter(
                Q(issn_online__icontains=issn) | 
                Q(issn_print__icontains=issn)
            )
                
        return queryset


class FeaturedJournalsView(generics.ListAPIView):
    """List featured journals for homepage."""
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    @method_decorator(cache_control(max_age=900, public=True))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    permission_classes = [AllowAny]
    serializer_class = JournalListSerializer
    
    def get_queryset(self):
        return Journal.objects.filter(is_active=True, is_featured=True).prefetch_related('subjects')


class JournalSearchView(generics.ListAPIView):
    """Search journals by title, description, or keywords."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalListSerializer
    
    def get_queryset(self):
        queryset = Journal.objects.filter(is_active=True).prefetch_related('subjects')
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
        return Journal.objects.filter(is_active=True).prefetch_related(
            'subjects', 
            'editorial_board_members', 
            'indexing_entries'
        )


class JournalDetailView(generics.RetrieveAPIView):
    """Get journal by ID."""
    
    permission_classes = [AllowAny]
    serializer_class = JournalDetailSerializer
    
    def get_queryset(self):
        return Journal.objects.filter(is_active=True).prefetch_related(
            'subjects', 
            'editorial_board_members', 
            'indexing_entries'
        )


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
        ).prefetch_related('subjects').distinct()


# =============================================================================
# Admin Journal Views
# =============================================================================

class JournalAdminListView(generics.ListAPIView):
    """Admin: List all journals (including inactive)."""
    
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_featured', 'subjects', 'subjects__slug']
    search_fields = ['title', 'short_title', 'description', 'issn_online', 'issn_print']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        return Journal.objects.all().prefetch_related('subjects')


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
# CTA Button Views
# =============================================================================

class CTAButtonListView(generics.ListAPIView):
    """Public: List active CTA buttons."""
    permission_classes = [AllowAny]
    serializer_class = CTAButtonSerializer
    
    def get_queryset(self):
        return CTAButton.objects.filter(is_active=True)


class CTAButtonBySlugView(generics.RetrieveAPIView):
    """Public: Get CTA button by slug."""
    permission_classes = [AllowAny]
    serializer_class = CTAButtonSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return CTAButton.objects.filter(is_active=True)


class CTAButtonAdminListView(generics.ListAPIView):
    """Admin: List all CTA buttons."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CTAButtonSerializer
    queryset = CTAButton.objects.all()


class CTAButtonAdminDetailView(generics.RetrieveUpdateAPIView):
    """Admin: Update a CTA button."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CTAButtonSerializer
    queryset = CTAButton.objects.all()


class CTAFormSubmissionCreateView(generics.CreateAPIView):
    """Public: Submit a CTA form."""
    permission_classes = [AllowAny]
    serializer_class = CTAFormSubmissionSerializer
    queryset = CTAFormSubmission.objects.all()
    
    def perform_create(self, serializer):
        submission = serializer.save()
        # TODO: Implement email sending logic here using submission.button.notification_email
        print(f"DEBUG: Form submitted for {submission.button.label}. Email notification would be sent to {submission.button.notification_email}")


class CTAFormSubmissionAdminListView(generics.ListAPIView):
    """Admin: List all form submissions."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CTAFormSubmissionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'affiliation']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return CTAFormSubmission.objects.all()


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


# =============================================================================
# CTA Card Views
# =============================================================================

class CTACardListView(generics.ListAPIView):
    """Public: List all active CTA cards."""
    permission_classes = [AllowAny]
    serializer_class = CTACardSerializer
    
    def get_queryset(self):
        return CTACard.objects.filter(is_active=True)


class CTACardAdminListView(generics.ListAPIView):
    """Admin: List all CTA cards."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CTACardSerializer
    queryset = CTACard.objects.all()


class CTACardCreateView(generics.CreateAPIView):
    """Admin: Create a new CTA card."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CTACardCreateUpdateSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class CTACardAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete a CTA card."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = CTACard.objects.all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CTACardCreateUpdateSerializer
        return CTACardSerializer


# =============================================================================
# Editorial Board Views
# =============================================================================

class EditorialBoardMemberAdminListView(generics.ListAPIView):
    """Admin: List members for a specific journal."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = EditorialBoardMemberSerializer

    def get_queryset(self):
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            return EditorialBoardMember.objects.filter(journal_id=journal_id)
        return EditorialBoardMember.objects.all()


class EditorialBoardMemberCreateView(generics.CreateAPIView):
    """Admin: Create a new board member."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = EditorialBoardMemberSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class EditorialBoardMemberAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete a board member."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = EditorialBoardMemberSerializer
    queryset = EditorialBoardMember.objects.all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# =============================================================================
# Journal Indexing Views
# =============================================================================

class JournalIndexingAdminListView(generics.ListAPIView):
    """Admin: List indexing entries for a specific journal."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalIndexingSerializer

    def get_queryset(self):
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            return JournalIndexing.objects.filter(journal_id=journal_id)
        return JournalIndexing.objects.all()


class JournalIndexingCreateView(generics.CreateAPIView):
    """Admin: Create a new indexing entry."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalIndexingSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class JournalIndexingAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete an indexing entry."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = JournalIndexingSerializer
    queryset = JournalIndexing.objects.all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# =============================================================================
# FAQ Views
# =============================================================================

class FAQAdminListView(generics.ListAPIView):
    """Admin: List FAQs for a specific journal."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = FAQSerializer

    def get_queryset(self):
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            return FAQ.objects.filter(journal_id=journal_id).order_by('display_order', 'created_at')
        return FAQ.objects.all().order_by('display_order', 'created_at')


class FAQCreateView(generics.CreateAPIView):
    """Admin: Create a new FAQ."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = FAQSerializer


class FAQAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: Get, update, or delete an FAQ."""
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = FAQSerializer
    queryset = FAQ.objects.all()
