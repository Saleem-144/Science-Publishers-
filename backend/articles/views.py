"""Views for articles app."""

from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from django.db.models import Q

from .models import (
    Author, Article, ArticleAuthor, ArticleFile,
    ArticleHTMLContent, Figure, Table
)
from journals.models import Journal
from issues.models import Issue
from .serializers import (
    AuthorSerializer, AuthorListSerializer,
    ArticleListSerializer, ArticleDetailSerializer,
    ArticleAbstractSerializer, ArticleFullTextSerializer,
    ArticleCreateUpdateSerializer, ArticleAuthorBulkSerializer,
    ArticleFileSerializer,
)


# =============================================================================
# Public Article Views
# =============================================================================

class ArticleListView(generics.ListAPIView):
    """
    List all published articles.
    
    GET /api/v1/articles/
    
    Query params:
    - issue: Filter by issue ID
    - journal: Filter by journal ID
    - type: Filter by article type
    - search: Search in title, abstract
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['issue', 'article_type', 'is_open_access']
    search_fields = ['title', 'abstract', 'keywords']
    ordering_fields = ['published_date', 'title', 'view_count']
    ordering = ['-published_date']
    
    def get_queryset(self):
        queryset = Article.objects.filter(status='published')
        
        # Filter by journal
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            queryset = queryset.filter(issue__volume__journal_id=journal_id)
        
        return queryset.select_related(
            'issue__volume__journal'
        ).prefetch_related('article_authors__author')


class ArticleSearchView(generics.ListAPIView):
    """
    Search articles.
    
    GET /api/v1/articles/search/?q=term
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if not query:
            return Article.objects.none()
        
        return Article.objects.filter(
            status='published'
        ).filter(
            Q(title__icontains=query) |
            Q(abstract__icontains=query) |
            Q(keywords__icontains=query) |
            Q(article_authors__author__last_name__icontains=query)
        ).distinct().select_related(
            'issue__volume__journal'
        ).prefetch_related('article_authors__author')


class FeaturedArticlesView(generics.ListAPIView):
    """
    List featured articles.
    
    GET /api/v1/articles/featured/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    pagination_class = None
    
    def get_queryset(self):
        return Article.objects.filter(
            status='published',
            is_featured=True
        ).select_related(
            'issue__volume__journal'
        ).prefetch_related('article_authors__author')[:10]


class RecentArticlesView(generics.ListAPIView):
    """
    List recent articles.
    
    GET /api/v1/articles/recent/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    pagination_class = None
    
    def get_queryset(self):
        # Optional filter by journal
        journal_slug = self.request.query_params.get('journal')
        queryset = Article.objects.filter(status='published')
        
        if journal_slug:
            queryset = queryset.filter(issue__volume__journal__slug=journal_slug)
        
        return queryset.order_by('-published_date').select_related(
            'issue__volume__journal'
        ).prefetch_related('article_authors__author')[:10]


class ArticleDetailView(generics.RetrieveAPIView):
    """
    Get article details by ID.
    
    GET /api/v1/articles/{id}/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleDetailSerializer
    
    def get_queryset(self):
        return Article.objects.filter(status='published')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ArticleBySlugView(generics.RetrieveAPIView):
    """
    Get article by journal slug and article slug.
    
    GET /api/v1/articles/by-journal/{journal_slug}/{article_slug}/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleDetailSerializer
    
    def get_object(self):
        journal_slug = self.kwargs['journal_slug']
        article_slug = self.kwargs['article_slug']
        
        article = get_object_or_404(
            Article.objects.select_related(
                'issue__volume__journal'
            ).prefetch_related(
                'article_authors__author', 'files', 'figures', 'tables'
            ),
            issue__volume__journal__slug=journal_slug,
            slug=article_slug,
            status='published'
        )
        
        article.increment_view_count()
        return article


class ArticleAbstractView(generics.RetrieveAPIView):
    """
    Get article abstract.
    
    GET /api/v1/articles/by-journal/{journal_slug}/{article_slug}/abstract/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleAbstractSerializer
    
    def get_object(self):
        journal_slug = self.kwargs['journal_slug']
        article_slug = self.kwargs['article_slug']
        
        return get_object_or_404(
            Article.objects.select_related('html_content'),
            issue__volume__journal__slug=journal_slug,
            slug=article_slug,
            status='published'
        )


class ArticleFullTextView(generics.RetrieveAPIView):
    """
    Get article full text with parsed HTML.
    
    GET /api/v1/articles/by-journal/{journal_slug}/{article_slug}/fulltext/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleFullTextSerializer
    
    def get_object(self):
        journal_slug = self.kwargs['journal_slug']
        article_slug = self.kwargs['article_slug']
        
        return get_object_or_404(
            Article.objects.select_related(
                'html_content'
            ).prefetch_related('figures', 'tables'),
            issue__volume__journal__slug=journal_slug,
            slug=article_slug,
            status='published'
        )


class ArticlePDFView(APIView):
    """
    Download article PDF.
    
    GET /api/v1/articles/by-journal/{journal_slug}/{article_slug}/pdf/
    """
    permission_classes = [AllowAny]
    
    def get(self, request, journal_slug, article_slug):
        article = get_object_or_404(
            Article,
            issue__volume__journal__slug=journal_slug,
            slug=article_slug,
            status='published'
        )
        
        # Get primary PDF file
        pdf_file = article.files.filter(
            file_type='pdf',
            is_primary=True
        ).first()
        
        if not pdf_file:
            pdf_file = article.files.filter(file_type='pdf').first()
        
        if not pdf_file or not pdf_file.file:
            return Response(
                {'error': 'PDF not available'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        article.increment_download_count()
        
        response = FileResponse(
            pdf_file.file.open('rb'),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'inline; filename="{pdf_file.original_filename or "article.pdf"}"'
        return response


class ArticleHTMLDownloadView(APIView):
    """
    Download article as offline HTML package.
    
    GET /api/v1/articles/by-journal/{journal_slug}/{article_slug}/html-download/
    """
    permission_classes = [AllowAny]
    
    def get(self, request, journal_slug, article_slug):
        article = get_object_or_404(
            Article.objects.select_related(
                'html_content', 'issue__volume__journal'
            ).prefetch_related('article_authors__author', 'figures'),
            issue__volume__journal__slug=journal_slug,
            slug=article_slug,
            status='published'
        )
        
        # Generate standalone HTML
        html_content = self._generate_standalone_html(article)
        
        response = HttpResponse(html_content, content_type='text/html')
        filename = f'{article.slug}.html'
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    
    def _generate_standalone_html(self, article):
        """Generate a self-contained HTML file for the article."""
        authors = ', '.join([
            aa.author.full_name 
            for aa in article.article_authors.order_by('author_order')
        ])
        
        body_html = ''
        if hasattr(article, 'html_content') and article.html_content:
            body_html = article.html_content.body_html or ''
        
        html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{article.title}</title>
    <style>
        body {{
            font-family: 'Georgia', 'Times New Roman', serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }}
        h1 {{ font-size: 1.8em; margin-bottom: 0.5em; }}
        .authors {{ color: #666; margin-bottom: 1em; }}
        .metadata {{ font-size: 0.9em; color: #888; margin-bottom: 2em; }}
        .abstract {{ 
            background: #f5f5f5; 
            padding: 1em; 
            border-left: 3px solid #2563eb;
            margin-bottom: 2em;
        }}
        .abstract h2 {{ margin-top: 0; }}
        .keywords {{ font-size: 0.9em; color: #666; }}
        h2 {{ border-bottom: 1px solid #eee; padding-bottom: 0.3em; }}
        figure {{ margin: 1.5em 0; text-align: center; }}
        figure img {{ max-width: 100%; }}
        figcaption {{ font-size: 0.9em; color: #666; margin-top: 0.5em; }}
        table {{ border-collapse: collapse; width: 100%; margin: 1em 0; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background: #f5f5f5; }}
        .references {{ font-size: 0.9em; }}
        .references li {{ margin-bottom: 0.5em; }}
    </style>
</head>
<body>
    <article>
        <h1>{article.title}</h1>
        <p class="authors">{authors}</p>
        <p class="metadata">
            {article.journal.title}<br>
            Volume {article.volume.volume_number}, Issue {article.issue.issue_number} ({article.volume.year})<br>
            {f'DOI: {article.doi}' if article.doi else ''}
        </p>
        
        <div class="abstract">
            <h2>Abstract</h2>
            <p>{article.abstract}</p>
            {f'<p class="keywords"><strong>Keywords:</strong> {", ".join(article.keywords)}</p>' if article.keywords else ''}
        </div>
        
        <div class="body">
            {body_html}
        </div>
    </article>
</body>
</html>'''
        return html


class ArticlesByIssueView(generics.ListAPIView):
    """
    List all articles in an issue.
    
    GET /api/v1/articles/by-issue/{issue_id}/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    pagination_class = None
    
    def get_queryset(self):
        issue_id = self.kwargs['issue_id']
        return Article.objects.filter(
            issue_id=issue_id,
            status='published'
        ).order_by('page_start', 'created_at')


# =============================================================================
# Author Views
# =============================================================================

class AuthorListView(generics.ListAPIView):
    """
    List all authors.
    
    GET /api/v1/articles/authors/
    """
    permission_classes = [AllowAny]
    serializer_class = AuthorListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'affiliation']
    ordering = ['last_name', 'first_name']
    
    def get_queryset(self):
        return Author.objects.all()


class AuthorDetailView(generics.RetrieveAPIView):
    """
    Get author details.
    
    GET /api/v1/articles/authors/{id}/
    """
    permission_classes = [AllowAny]
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()


class ArticlesByAuthorView(generics.ListAPIView):
    """
    List articles by a specific author.
    
    GET /api/v1/articles/authors/{id}/articles/
    """
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    
    def get_queryset(self):
        author_id = self.kwargs['pk']
        return Article.objects.filter(
            authors__id=author_id,
            status='published'
        ).order_by('-published_date')


# =============================================================================
# Admin Views
# =============================================================================

class ArticleAdminListView(generics.ListAPIView):
    """
    List all articles (admin view).
    
    GET /api/v1/articles/admin/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ArticleListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['issue', 'status', 'article_type']
    search_fields = ['title', 'doi']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Article.objects.all()
        
        # Filter by journal
        journal_id = self.request.query_params.get('journal')
        if journal_id:
            queryset = queryset.filter(issue__volume__journal_id=journal_id)
        
        return queryset


class ArticleCreateView(generics.CreateAPIView):
    """
    Create a new article (admin only).
    
    POST /api/v1/articles/admin/create/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = ArticleCreateUpdateSerializer


class ArticleAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete an article (admin only).
    
    GET/PUT/PATCH/DELETE /api/v1/articles/admin/{id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Article.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ArticleCreateUpdateSerializer
        return ArticleDetailSerializer


class ArticleAuthorsUpdateView(APIView):
    """
    Update article authors (bulk).
    
    PUT /api/v1/articles/admin/{id}/authors/
    Body: { "authors": [{ "author_id": 1, "author_order": 1, "is_corresponding": true }, ...] }
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def put(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        serializer = ArticleAuthorBulkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update_authors(article)
        
        return Response({'detail': 'Authors updated successfully.'})


class ArticleFilesView(APIView):
    """
    Upload files to an article.
    
    POST /api/v1/articles/admin/{id}/files/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        files = article.files.all()
        serializer = ArticleFileSerializer(files, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        
        file = request.FILES.get('file')
        file_type = request.data.get('file_type', 'supplementary')
        is_primary = request.data.get('is_primary', 'false').lower() == 'true'
        description = request.data.get('description', '')
        
        if not file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Determine MIME type
        mime_type = file.content_type
        
        article_file = ArticleFile.objects.create(
            article=article,
            file_type=file_type,
            file=file,
            original_filename=file.name,
            mime_type=mime_type,
            is_primary=is_primary,
            description=description
        )
        
        serializer = ArticleFileSerializer(article_file, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ArticleFileDeleteView(APIView):
    """
    Delete a file from an article.
    
    DELETE /api/v1/articles/admin/{id}/files/{file_id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def delete(self, request, pk, file_id):
        article = get_object_or_404(Article, pk=pk)
        article_file = get_object_or_404(ArticleFile, pk=file_id, article=article)
        
        # Delete the actual file
        if article_file.file:
            article_file.file.delete()
        
        article_file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# =============================================================================
# Author Admin Views
# =============================================================================

class AuthorAdminListView(generics.ListAPIView):
    """
    List all authors (admin view).
    
    GET /api/v1/articles/admin/authors/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AuthorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'affiliation']
    ordering = ['last_name', 'first_name']
    queryset = Author.objects.all()


class AuthorCreateView(generics.CreateAPIView):
    """
    Create a new author (admin only).
    
    POST /api/v1/articles/admin/authors/create/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AuthorSerializer


class AuthorAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete an author (admin only).
    
    GET/PUT/PATCH/DELETE /api/v1/articles/admin/authors/{id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
