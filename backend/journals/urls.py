"""URL configuration for journals app."""

from django.urls import path
from . import views

app_name = 'journals'

urlpatterns = [
    # Public endpoints
    path('', views.JournalListView.as_view(), name='journal_list'),
    path('featured/', views.FeaturedJournalsView.as_view(), name='featured_journals'),
    path('search/', views.JournalSearchView.as_view(), name='journal_search'),
    path('by-slug/<slug:slug>/', views.JournalBySlugView.as_view(), name='journal_by_slug'),
    path('<int:pk>/', views.JournalDetailView.as_view(), name='journal_detail'),
    
    # Subject endpoints
    path('subjects/', views.SubjectListView.as_view(), name='subject_list'),
    path('subjects/<slug:slug>/', views.SubjectDetailView.as_view(), name='subject_detail'),
    path('subjects/<slug:slug>/journals/', views.JournalsBySubjectView.as_view(), name='journals_by_subject'),
    
    # Announcement endpoints (public)
    path('announcements/', views.AnnouncementListView.as_view(), name='announcement_list'),
    path('announcements/homepage/', views.HomepageAnnouncementsView.as_view(), name='homepage_announcements'),
    path('announcements/by-slug/<slug:slug>/', views.AnnouncementBySlugView.as_view(), name='announcement_by_slug'),
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement_detail'),
    
    # Admin endpoints
    path('admin/', views.JournalAdminListView.as_view(), name='admin_journal_list'),
    path('admin/create/', views.JournalCreateView.as_view(), name='admin_journal_create'),
    path('admin/<int:pk>/', views.JournalAdminDetailView.as_view(), name='admin_journal_detail'),
    path('admin/subjects/', views.SubjectAdminListView.as_view(), name='admin_subject_list'),
    path('admin/subjects/create/', views.SubjectCreateView.as_view(), name='admin_subject_create'),
    path('admin/subjects/<int:pk>/', views.SubjectAdminDetailView.as_view(), name='admin_subject_detail'),
    
    # Announcement admin endpoints
    path('admin/announcements/', views.AnnouncementAdminListView.as_view(), name='admin_announcement_list'),
    path('admin/announcements/create/', views.AnnouncementCreateView.as_view(), name='admin_announcement_create'),
    path('admin/announcements/<int:pk>/', views.AnnouncementAdminDetailView.as_view(), name='admin_announcement_detail'),
    
    # Corporate Affiliation endpoints (public)
    path('affiliations/', views.CorporateAffiliationListView.as_view(), name='affiliation_list'),
    
    # CTA Cards (public)
    path('cta-cards/', views.CTACardListView.as_view(), name='cta_card_list'),
    
    # Corporate Affiliation admin endpoints
    path('admin/affiliations/', views.CorporateAffiliationAdminListView.as_view(), name='admin_affiliation_list'),
    path('admin/affiliations/create/', views.CorporateAffiliationCreateView.as_view(), name='admin_affiliation_create'),
    path('admin/affiliations/<int:pk>/', views.CorporateAffiliationAdminDetailView.as_view(), name='admin_affiliation_detail'),

    # CTA Cards (admin)
    path('admin/cta-cards/', views.CTACardAdminListView.as_view(), name='admin_cta_card_list'),
    path('admin/cta-cards/create/', views.CTACardCreateView.as_view(), name='admin_cta_card_create'),
    path('admin/cta-cards/<int:pk>/', views.CTACardAdminDetailView.as_view(), name='admin_cta_card_detail'),

    # Editorial Board admin endpoints
    path('admin/editorial-board/', views.EditorialBoardMemberAdminListView.as_view(), name='admin_editorial_board_list'),
    path('admin/editorial-board/create/', views.EditorialBoardMemberCreateView.as_view(), name='admin_editorial_board_create'),
    path('admin/editorial-board/<int:pk>/', views.EditorialBoardMemberAdminDetailView.as_view(), name='admin_editorial_board_detail'),

    # Journal Indexing admin endpoints
    path('admin/indexing/', views.JournalIndexingAdminListView.as_view(), name='admin_indexing_list'),
    path('admin/indexing/create/', views.JournalIndexingCreateView.as_view(), name='admin_indexing_create'),
    path('admin/indexing/<int:pk>/', views.JournalIndexingAdminDetailView.as_view(), name='admin_indexing_detail'),

    # FAQ admin endpoints
    path('admin/faqs/', views.FAQAdminListView.as_view(), name='admin_faq_list'),
    path('admin/faqs/create/', views.FAQCreateView.as_view(), name='admin_faq_create'),
    path('admin/faqs/<int:pk>/', views.FAQAdminDetailView.as_view(), name='admin_faq_detail'),

    # Global Indexing Journal endpoints
    path('indexing-platforms/', views.IndexingPlatformListView.as_view(), name='indexing_platform_list'),
    path('admin/indexing-platforms/', views.IndexingPlatformAdminListView.as_view(), name='admin_indexing_platform_list'),
    path('admin/indexing-platforms/create/', views.IndexingPlatformCreateView.as_view(), name='admin_indexing_platform_create'),
    path('admin/indexing-platforms/<int:pk>/', views.IndexingPlatformAdminDetailView.as_view(), name='admin_indexing_platform_detail'),
    path('admin/indexing-links/', views.JournalIndexingLinkAdminListView.as_view(), name='admin_indexing_link_list'),
    path('admin/indexing-links/create/', views.JournalIndexingLinkCreateView.as_view(), name='admin_indexing_link_create'),
    path('admin/indexing-links/<int:pk>/', views.JournalIndexingLinkAdminDetailView.as_view(), name='admin_indexing_link_detail'),

    # CTA Buttons & Form Submissions
    path('cta-buttons/', views.CTAButtonListView.as_view(), name='cta_button_list'),
    path('cta-buttons/by-slug/<slug:slug>/', views.CTAButtonBySlugView.as_view(), name='cta_button_by_slug'),
    path('cta-buttons/submit/', views.CTAFormSubmissionCreateView.as_view(), name='cta_submission_create'),
    path('admin/cta-buttons/', views.CTAButtonAdminListView.as_view(), name='admin_cta_button_list'),
    path('admin/cta-buttons/<int:pk>/', views.CTAButtonAdminDetailView.as_view(), name='admin_cta_button_detail'),
    path('admin/cta-submissions/', views.CTAFormSubmissionAdminListView.as_view(), name='admin_cta_submission_list'),
]



