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
    
    # Corporate Affiliation admin endpoints
    path('admin/affiliations/', views.CorporateAffiliationAdminListView.as_view(), name='admin_affiliation_list'),
    path('admin/affiliations/create/', views.CorporateAffiliationCreateView.as_view(), name='admin_affiliation_create'),
    path('admin/affiliations/<int:pk>/', views.CorporateAffiliationAdminDetailView.as_view(), name='admin_affiliation_detail'),
]



