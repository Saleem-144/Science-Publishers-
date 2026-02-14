"""URL configuration for site settings and pages."""

from django.urls import path
from . import views

app_name = 'media_files'

urlpatterns = [
    # Public endpoints
    path('settings/', views.SiteSettingsView.as_view(), name='site_settings'),
    path('pages/', views.PageListView.as_view(), name='page_list'),
    path('pages/<slug:slug>/', views.PageDetailView.as_view(), name='page_detail'),
    
    # Admin endpoints
    path('admin/pages/', views.PageAdminListView.as_view(), name='admin_page_list'),
    path('admin/pages/create/', views.PageCreateView.as_view(), name='admin_page_create'),
    path('admin/pages/<int:pk>/', views.PageAdminDetailView.as_view(), name='admin_page_detail'),
    path('admin/stats/', views.DashboardStatsView.as_view(), name='admin_dashboard_stats'),
]
























