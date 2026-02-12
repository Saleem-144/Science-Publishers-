"""URL configuration for articles app."""

from django.urls import path
from . import views

app_name = 'articles'

urlpatterns = [
    # Public endpoints
    path('', views.ArticleListView.as_view(), name='article_list'),
    path('search/', views.ArticleSearchView.as_view(), name='article_search'),
    path('featured/', views.FeaturedArticlesView.as_view(), name='featured_articles'),
    path('recent/', views.RecentArticlesView.as_view(), name='recent_articles'),
    path('special-issues/', views.SpecialIssuesArticlesView.as_view(), name='special_issues_articles'),
    path('<int:pk>/', views.ArticleDetailView.as_view(), name='article_detail'),
    
    # Article by journal and slug
    path('by-journal/<slug:journal_slug>/<slug:article_slug>/', views.ArticleBySlugView.as_view(), name='article_by_slug'),
    path('by-journal/<slug:journal_slug>/<slug:article_slug>/abstract/', views.ArticleAbstractView.as_view(), name='article_abstract'),
    path('by-journal/<slug:journal_slug>/<slug:article_slug>/fulltext/', views.ArticleFullTextView.as_view(), name='article_fulltext'),
    path('by-journal/<slug:journal_slug>/<slug:article_slug>/pdf/', views.ArticlePDFView.as_view(), name='article_pdf'),
    path('by-journal/<slug:journal_slug>/<slug:article_slug>/xml/', views.ArticleXMLDownloadView.as_view(), name='article_xml'),
    path('by-journal/<slug:journal_slug>/<slug:article_slug>/html-download/', views.ArticleHTMLDownloadView.as_view(), name='article_html_download'),
    
    # Articles by issue
    path('by-issue/<int:issue_id>/', views.ArticlesByIssueView.as_view(), name='articles_by_issue'),
    
    # Author endpoints
    path('authors/', views.AuthorListView.as_view(), name='author_list'),
    path('authors/<int:pk>/', views.AuthorDetailView.as_view(), name='author_detail'),
    path('authors/<int:pk>/articles/', views.ArticlesByAuthorView.as_view(), name='articles_by_author'),
    
    # Admin endpoints
    path('admin/', views.ArticleAdminListView.as_view(), name='admin_article_list'),
    path('admin/create/', views.ArticleCreateView.as_view(), name='admin_article_create'),
    path('admin/<int:pk>/', views.ArticleAdminDetailView.as_view(), name='admin_article_detail'),
    path('admin/<int:pk>/authors/', views.ArticleAuthorsUpdateView.as_view(), name='admin_article_authors'),
    path('admin/<int:pk>/files/', views.ArticleFilesView.as_view(), name='admin_article_files'),
    path('admin/<int:pk>/files/<int:file_id>/', views.ArticleFileDeleteView.as_view(), name='admin_article_file_delete'),
    
    # Author admin
    path('admin/authors/', views.AuthorAdminListView.as_view(), name='admin_author_list'),
    path('admin/authors/create/', views.AuthorCreateView.as_view(), name='admin_author_create'),
    path('admin/authors/<int:pk>/', views.AuthorAdminDetailView.as_view(), name='admin_author_detail'),
]

















