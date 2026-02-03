"""URL configuration for accounts app (authentication)."""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'accounts'

urlpatterns = [
    # JWT Authentication
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User management
    path('me/', views.CurrentUserView.as_view(), name='current_user'),
    path('password/change/', views.ChangePasswordView.as_view(), name='change_password'),
]
















