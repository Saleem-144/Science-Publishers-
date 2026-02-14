"""URL configuration for volumes app."""

from django.urls import path
from . import views

app_name = 'volumes'

urlpatterns = [
    # Public endpoints
    path('', views.VolumeListView.as_view(), name='volume_list'),
    path('<int:pk>/', views.VolumeDetailView.as_view(), name='volume_detail'),
    path('by-journal/<slug:journal_slug>/', views.VolumesByJournalView.as_view(), name='volumes_by_journal'),
    path('by-journal/<slug:journal_slug>/<int:volume_number>/', views.VolumeByNumberView.as_view(), name='volume_by_number'),
    
    # Admin endpoints
    path('admin/', views.VolumeAdminListView.as_view(), name='admin_volume_list'),
    path('admin/create/', views.VolumeCreateView.as_view(), name='admin_volume_create'),
    path('admin/<int:pk>/', views.VolumeAdminDetailView.as_view(), name='admin_volume_detail'),
]
























