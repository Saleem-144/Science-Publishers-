"""URL configuration for issues app."""

from django.urls import path
from . import views

app_name = 'issues'

urlpatterns = [
    # Public endpoints
    path('', views.IssueListView.as_view(), name='issue_list'),
    path('<int:pk>/', views.IssueDetailView.as_view(), name='issue_detail'),
    path('by-volume/<int:volume_id>/', views.IssuesByVolumeView.as_view(), name='issues_by_volume'),
    path('by-journal/<slug:journal_slug>/current/', views.CurrentIssueView.as_view(), name='current_issue'),
    path('by-journal/<slug:journal_slug>/<int:issue_number>/', views.IssueByNumberView.as_view(), name='issue_by_number'),
    
    # Admin endpoints
    path('admin/', views.IssueAdminListView.as_view(), name='admin_issue_list'),
    path('admin/create/', views.IssueCreateView.as_view(), name='admin_issue_create'),
    path('admin/<int:pk>/', views.IssueAdminDetailView.as_view(), name='admin_issue_detail'),
]











