"""
URL Configuration for Academic Journal Publishing Platform.

API routes are prefixed with /api/v1/
Admin routes are at /admin/
API documentation at /api/docs/
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Django Admin (built-in)
    path('admin/', admin.site.urls),
    
    # API v1 routes
    path('api/v1/', include([
        # Authentication
        path('auth/', include('accounts.urls')),
        
        # Content APIs
        path('journals/', include('journals.urls')),
        path('volumes/', include('volumes.urls')),
        path('issues/', include('issues.urls')),
        path('articles/', include('articles.urls')),
        
        # Site management
        path('site/', include('media_files.urls')),
        
        # XML Parser
        path('xml/', include('xml_parser.urls')),
    ])),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
