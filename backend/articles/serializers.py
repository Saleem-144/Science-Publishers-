"""Serializers for articles app."""

from rest_framework import serializers
from .models import (
    Author, Article, ArticleAuthor, ArticleFile,
    ArticleHTMLContent, Figure, Table
)


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for Author model."""
    
    full_name = serializers.CharField(read_only=True)
    citation_name = serializers.CharField(read_only=True)
    article_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Author
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'citation_name',
            'email', 'orcid_id',
            'affiliation', 'department', 'country',
            'bio', 'article_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AuthorListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for author listings."""
    
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Author
        fields = ['id', 'first_name', 'last_name', 'full_name', 'orcid_id', 'affiliation', 'department', 'country']


class ArticleAuthorSerializer(serializers.ModelSerializer):
    """Serializer for article-author relationships."""
    
    author = AuthorListSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(),
        write_only=True,
        source='author'
    )
    
    class Meta:
        model = ArticleAuthor
        fields = [
            'id', 'author', 'author_id', 'author_order',
            'is_corresponding', 'author_contribution'
        ]
        read_only_fields = ['id']


class ArticleFileSerializer(serializers.ModelSerializer):
    """Serializer for article files."""
    
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ArticleFile
        fields = [
            'id', 'file_type', 'file', 'file_url',
            'original_filename', 'file_size', 'mime_type',
            'is_primary', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'file_size', 'mime_type', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class FigureSerializer(serializers.ModelSerializer):
    """Serializer for figures."""
    
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Figure
        fields = [
            'id', 'figure_id', 'figure_number', 'label',
            'caption', 'image', 'image_url', 'original_filename',
            'display_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class TableSerializer(serializers.ModelSerializer):
    """Serializer for tables."""
    
    class Meta:
        model = Table
        fields = [
            'id', 'table_id', 'table_number', 'label',
            'caption', 'table_html', 'footnotes',
            'display_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ArticleHTMLContentSerializer(serializers.ModelSerializer):
    """Serializer for article HTML content."""
    
    class Meta:
        model = ArticleHTMLContent
        fields = [
            'id', 'original_xml',
            'abstract_html', 'body_html', 'references_html', 'acknowledgments_html',
            'figures_json', 'tables_json',
            'parsing_status', 'parsing_errors', 'parsed_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'parsed_at', 'created_at', 'updated_at']


class ArticleListSerializer(serializers.ModelSerializer):
    """Serializer for article listings."""
    
    authors = serializers.SerializerMethodField()
    article_type_display = serializers.CharField(source='get_article_type_display', read_only=True)
    journal_info = serializers.SerializerMethodField()
    journal_slug = serializers.SerializerMethodField()
    volume_info = serializers.SerializerMethodField()
    issue_info = serializers.SerializerMethodField()
    # Support for legacy frontend expectation of nested issue.volume.journal
    issue = serializers.SerializerMethodField()
    pages = serializers.CharField(read_only=True)
    volume_number = serializers.CharField(read_only=True)
    issue_number = serializers.CharField(read_only=True)
    year = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'article_id_code', 'title', 'slug', 'doi', 'article_type', 'article_type_display',
            'status', 'abstract', 'keywords', 'keywords_display', 'pages',
            'volume_number', 'issue_number', 'year',
            'journal_info', 'journal_slug', 'volume_info', 'issue_info', 'issue',
            'published_date', 'is_open_access', 'is_featured', 'is_special_issue',
            'pdf_file', 'xml_file', 'epub_file', 'mobi_file', 'prc_file',
            'authors', 'view_count'
        ]
    
    def get_authors(self, obj):
        article_authors = obj.article_authors.order_by('author_order')
        return [
            {
                'id': aa.author.id,
                'name': aa.author.full_name,
                'is_corresponding': aa.is_corresponding
            }
            for aa in article_authors
        ]

    def get_journal_info(self, obj):
        journal = obj.get_journal
        if not journal: return None
        return {
            'id': journal.id,
            'title': journal.title,
            'slug': journal.slug,
        }

    def get_journal_slug(self, obj):
        journal = obj.get_journal
        return journal.slug if journal else None

    def get_volume_info(self, obj):
        volume = obj.get_volume
        if not volume: return None
        return {
            'id': volume.id,
            'volume_number': volume.volume_number,
            'year': volume.year,
        }

    def get_issue_info(self, obj):
        issue = obj.issue
        if not issue: return None
        return {
            'id': issue.id,
            'issue_number': issue.issue_number,
            'title': issue.title,
        }

    def get_issue(self, obj):
        """Provide nested structure for frontend filtering and display."""
        issue = obj.issue
        volume = obj.get_volume
        journal = obj.get_journal
        
        journal_data = {
            'id': journal.id,
            'title': journal.title,
            'slug': journal.slug
        } if journal else None
        
        volume_data = {
            'id': volume.id,
            'volume_number': volume.volume_number,
            'year': volume.year,
            'journal': journal_data
        } if volume else None
        
        if issue:
            return {
                'id': issue.id,
                'issue_number': issue.issue_number,
                'title': issue.title,
                'volume': volume_data
            }
        elif volume:
            # If no issue but has volume, still provide nested volume for journal access
            return {
                'id': None,
                'volume': volume_data
            }
        return None


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Full serializer for article detail view."""
    
    authors = serializers.SerializerMethodField()
    journal_info = serializers.SerializerMethodField()
    volume_info = serializers.SerializerMethodField()
    issue_info = serializers.SerializerMethodField()
    html_content = ArticleHTMLContentSerializer(read_only=True)
    files = ArticleFileSerializer(many=True, read_only=True)
    figures = FigureSerializer(many=True, read_only=True)
    tables = TableSerializer(many=True, read_only=True)
    pages = serializers.CharField(read_only=True)
    citation = serializers.CharField(read_only=True)
    corresponding_author = serializers.SerializerMethodField()
    next_article = serializers.SerializerMethodField()
    previous_article = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'article_id_code', 'title', 'slug', 'doi', 'article_type', 'status',
            'abstract', 'keywords', 'keywords_display', 'license_text',
            'pages', 'page_start', 'page_end', 'article_number',
            'received_date', 'revised_date', 'accepted_date', 'published_date',
            'is_open_access', 'is_featured', 'is_special_issue',
            'xml_file', 'pdf_file', 'epub_file', 'prc_file', 'mobi_file',
            'view_count', 'download_count',
            'meta_title', 'meta_description',
            'journal', 'journal_info', 'volume', 'volume_info', 'issue', 'issue_info',
            'authors', 'corresponding_author',
            'html_content', 'files', 'figures', 'tables',
            'citation', 'next_article', 'previous_article',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'view_count', 'download_count', 'created_at', 'updated_at']
    
    def get_authors(self, obj):
        article_authors = obj.article_authors.order_by('author_order')
        return [
            {
                'id': aa.author.id,
                'first_name': aa.author.first_name,
                'last_name': aa.author.last_name,
                'full_name': aa.author.full_name,
                'email': aa.author.email,
                'orcid_id': aa.author.orcid_id,
                'affiliation': aa.author.affiliation,
                'department': aa.author.department,
                'is_corresponding': aa.is_corresponding,
                'author_order': aa.author_order,
                'contribution': aa.author_contribution,
                'bio': aa.author.bio
            }
            for aa in article_authors
        ]
    
    def get_journal_info(self, obj):
        journal = obj.get_journal
        if not journal: return None
        return {
            'id': journal.id,
            'title': journal.title,
            'slug': journal.slug,
            'short_title': journal.short_title,
            'issn_print': journal.issn_print,
            'issn_online': journal.issn_online,
            'subjects': [
                {'id': s.id, 'name': s.name, 'slug': s.slug}
                for s in journal.subjects.all()
            ]
        }
    
    def get_volume_info(self, obj):
        volume = obj.get_volume
        if not volume: return None
        return {
            'id': volume.id,
            'volume_number': volume.volume_number,
            'year': volume.year,
            'title': volume.title,
        }
    
    def get_issue_info(self, obj):
        issue = obj.issue
        if not issue: return None
        return {
            'id': issue.id,
            'issue_number': issue.issue_number,
            'title': issue.title,
            'publication_date': issue.publication_date,
            'is_special_issue': issue.is_special_issue,
            'special_issue_title': issue.special_issue_title,
        }
    
    def get_corresponding_author(self, obj):
        author = obj.get_corresponding_author()
        if author:
            return {
                'id': author.id,
                'name': author.full_name,
                'email': author.email,
                'affiliation': author.affiliation,
            }
        return None

    def get_next_article(self, obj):
        try:
            if not obj.published_date: return None
            journal = obj.get_journal
            if not journal: return None
            next_art = Article.objects.filter(
                status='published',
                published_date__gt=obj.published_date
            ).filter(
                models.Q(journal=journal) | 
                models.Q(issue__volume__journal=journal) |
                models.Q(volume__journal=journal)
            ).order_by('published_date').first()
            
            if not next_art: return None
            return {'slug': next_art.slug, 'title': next_art.title}
        except Exception:
            return None

    def get_previous_article(self, obj):
        try:
            if not obj.published_date: return None
            journal = obj.get_journal
            if not journal: return None
            prev_art = Article.objects.filter(
                status='published',
                published_date__lt=obj.published_date
            ).filter(
                models.Q(journal=journal) | 
                models.Q(issue__volume__journal=journal) |
                models.Q(volume__journal=journal)
            ).order_by('-published_date').first()
            
            if not prev_art: return None
            return {'slug': prev_art.slug, 'title': prev_art.title}
        except Exception:
            return None


class ArticleAbstractSerializer(serializers.ModelSerializer):
    """Serializer for article abstract view."""
    
    authors = serializers.SerializerMethodField()
    abstract_html = serializers.SerializerMethodField()
    journal_slug = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'doi', 'article_type',
            'abstract', 'abstract_html', 'keywords', 'keywords_display',
            'journal_slug', 'published_date', 'received_date', 'revised_date', 'accepted_date',
            'license_text', 'authors'
        ]
    
    def get_authors(self, obj):
        article_authors = obj.article_authors.order_by('author_order')
        return [
            {
                'id': aa.author.id,
                'full_name': aa.author.full_name,
                'email': aa.author.email if aa.is_corresponding else None,
                'orcid_id': aa.author.orcid_id,
                'affiliation': aa.author.affiliation,
                'department': aa.author.department,
                'is_corresponding': aa.is_corresponding,
                'bio': aa.author.bio
            }
            for aa in article_authors
        ]
    
    def get_abstract_html(self, obj):
        try:
            return obj.html_content.abstract_html
        except ArticleHTMLContent.DoesNotExist:
            return obj.abstract

    def get_journal_slug(self, obj):
        journal = obj.get_journal
        return journal.slug if journal else None


class ArticleFullTextSerializer(serializers.ModelSerializer):
    """Serializer for article full text view."""
    
    authors = serializers.SerializerMethodField()
    html_content = ArticleHTMLContentSerializer(read_only=True)
    figures = FigureSerializer(many=True, read_only=True)
    tables = TableSerializer(many=True, read_only=True)
    journal_slug = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'doi',
            'abstract', 'keywords', 'keywords_display',
            'journal_slug', 'published_date', 'received_date', 'revised_date', 'accepted_date',
            'license_text', 'authors', 'html_content', 'figures', 'tables'
        ]
    
    def get_authors(self, obj):
        article_authors = obj.article_authors.order_by('author_order')
        return [
            {
                'id': aa.author.id,
                'full_name': aa.author.full_name,
                'email': aa.author.email if aa.is_corresponding else None,
                'orcid_id': aa.author.orcid_id,
                'affiliation': aa.author.affiliation,
                'department': aa.author.department,
                'is_corresponding': aa.is_corresponding,
                'bio': aa.author.bio
            }
            for aa in article_authors
        ]

    def get_journal_slug(self, obj):
        journal = obj.get_journal
        return journal.slug if journal else None


class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating articles."""
    
    class Meta:
        model = Article
        fields = [
            'id', 'journal', 'volume', 'issue', 'article_id_code', 'title', 'slug', 'doi', 
            'article_type', 'status', 'is_special_issue',
            'abstract', 'keywords', 'keywords_display', 'license_text',
            'xml_file', 'pdf_file', 'epub_file', 'prc_file', 'mobi_file',
            'page_start', 'page_end', 'article_number',
            'received_date', 'revised_date', 'accepted_date', 'published_date',
            'is_open_access', 'is_featured',
            'meta_title', 'meta_description'
        ]
        read_only_fields = ['id']

    def to_internal_value(self, data):
        # Handle string input for JSON fields when using multipart/form-data
        if hasattr(data, 'dict'):
            data = data.dict()
        else:
            data = dict(data)
        
        # Handle keywords: convert comma-separated string to list
        if 'keywords' in data:
            keywords_val = data.get('keywords')
            if isinstance(keywords_val, str):
                if keywords_val.strip():
                    try:
                        # Try parsing as JSON first
                        import json
                        parsed = json.loads(keywords_val)
                        if isinstance(parsed, list):
                            data['keywords'] = parsed
                        else:
                            data['keywords'] = [k.strip() for k in keywords_val.split(',') if k.strip()]
                    except (json.JSONDecodeError, ValueError):
                        # Fallback to comma-separated
                        data['keywords'] = [k.strip() for k in keywords_val.split(',') if k.strip()]
                else:
                    data['keywords'] = []

        # Handle empty strings for foreign keys and dates
        empty_to_none_fields = [
            'volume', 'issue', 'journal', 
            'received_date', 'revised_date', 'accepted_date', 'published_date'
        ]
        for field in empty_to_none_fields:
            if field in data and data[field] == '':
                data[field] = None
        
        return super().to_internal_value(data)


class ArticleAuthorLinkSerializer(serializers.Serializer):
    """Serializer for individual author-article links."""
    author_id = serializers.IntegerField()
    author_order = serializers.IntegerField(default=1)
    is_corresponding = serializers.BooleanField(default=False)
    author_contribution = serializers.CharField(required=False, allow_blank=True)


class ArticleAuthorBulkSerializer(serializers.Serializer):
    """Serializer for bulk updating article authors."""
    
    authors = ArticleAuthorLinkSerializer(many=True)
    
    def update_authors(self, article):
        authors_data = self.validated_data['authors']
        
        # Remove existing authors
        article.article_authors.all().delete()
        
        # Add new authors
        for author_data in authors_data:
            ArticleAuthor.objects.create(
                article=article,
                author_id=author_data['author_id'],
                author_order=author_data.get('author_order', 1),
                is_corresponding=author_data.get('is_corresponding', False),
                author_contribution=author_data.get('author_contribution', '')
            )
        
        return article
