"""URL configuration for xml_parser app."""

from django.urls import path
from . import views

app_name = 'xml_parser'

urlpatterns = [
    path('upload/<int:article_id>/', views.XMLUploadView.as_view(), name='xml_upload'),
    path('process/<int:article_id>/', views.XMLProcessView.as_view(), name='xml_process'),
    path('reparse/<int:article_id>/', views.XMLReparseView.as_view(), name='xml_reparse'),
    path('status/<int:article_id>/', views.XMLStatusView.as_view(), name='xml_status'),
    path('preview/<int:article_id>/', views.XMLPreviewView.as_view(), name='xml_preview'),
]









