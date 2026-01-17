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
        fields = ['id', 'first_name', 'last_name', 'full_name', 'affiliation', 'country']


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
            'is_corresponding', 'author_contribution', 'affiliation'
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
    journal_slug = serializers.CharField(source='issue.volume.journal.slug', read_only=True)
    journal_title = serializers.CharField(source='issue.volume.journal.title', read_only=True)
    volume_number = serializers.IntegerField(source='issue.volume.volume_number', read_only=True)
    issue_number = serializers.IntegerField(source='issue.issue_number', read_only=True)
    year = serializers.IntegerField(source='issue.volume.year', read_only=True)
    pages = serializers.CharField(read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'doi', 'article_type', 'article_type_display',
            'abstract', 'keywords', 'pages',
            'journal_slug', 'journal_title',
            'volume_number', 'issue_number', 'year',
            'published_date', 'is_open_access', 'is_featured',
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


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Full serializer for article detail view."""
    
    authors = serializers.SerializerMethodField()
    journal = serializers.SerializerMethodField()
    volume = serializers.SerializerMethodField()
    issue_info = serializers.SerializerMethodField()
    files = ArticleFileSerializer(many=True, read_only=True)
    figures = FigureSerializer(many=True, read_only=True)
    tables = TableSerializer(many=True, read_only=True)
    pages = serializers.CharField(read_only=True)
    citation = serializers.CharField(read_only=True)
    corresponding_author = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'doi', 'article_type', 'status',
            'abstract', 'keywords', 'pages', 'page_start', 'page_end', 'article_number',
            'received_date', 'revised_date', 'accepted_date', 'published_date',
            'is_open_access', 'is_featured',
            'view_count', 'download_count',
            'meta_title', 'meta_description',
            'journal', 'volume', 'issue', 'issue_info',
            'authors', 'corresponding_author',
            'files', 'figures', 'tables',
            'citation',
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
                'email': aa.author.email if aa.is_corresponding else None,
                'orcid_id': aa.author.orcid_id,
                'affiliation': aa.affiliation,
                'is_corresponding': aa.is_corresponding,
                'author_order': aa.author_order,
                'contribution': aa.author_contribution
            }
            for aa in article_authors
        ]
    
    def get_journal(self, obj):
        journal = obj.journal
        return {
            'id': journal.id,
            'title': journal.title,
            'slug': journal.slug,
            'short_title': journal.short_title,
            'issn_print': journal.issn_print,
            'issn_online': journal.issn_online,
        }
    
    def get_volume(self, obj):
        volume = obj.volume
        return {
            'id': volume.id,
            'volume_number': volume.volume_number,
            'year': volume.year,
            'title': volume.title,
        }
    
    def get_issue_info(self, obj):
        issue = obj.issue
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


class ArticleAbstractSerializer(serializers.ModelSerializer):
    """Serializer for article abstract view."""
    
    authors = serializers.SerializerMethodField()
    abstract_html = serializers.SerializerMethodField()
    journal_slug = serializers.CharField(source='issue.volume.journal.slug', read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'doi', 'article_type',
            'abstract', 'abstract_html', 'keywords',
            'journal_slug', 'published_date',
            'authors'
        ]
    
    def get_authors(self, obj):
        article_authors = obj.article_authors.order_by('author_order')
        return [
            {
                'name': aa.author.full_name,
                'affiliation': aa.affiliation,
                'is_corresponding': aa.is_corresponding
            }
            for aa in article_authors
        ]
    
    def get_abstract_html(self, obj):
        try:
            return obj.html_content.abstract_html
        except ArticleHTMLContent.DoesNotExist:
            return obj.abstract


class ArticleFullTextSerializer(serializers.ModelSerializer):
    """Serializer for article full text view."""
    
    authors = serializers.SerializerMethodField()
    html_content = ArticleHTMLContentSerializer(read_only=True)
    figures = FigureSerializer(many=True, read_only=True)
    tables = TableSerializer(many=True, read_only=True)
    journal_slug = serializers.CharField(source='issue.volume.journal.slug', read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'doi',
            'abstract', 'keywords',
            'journal_slug', 'published_date',
            'authors', 'html_content', 'figures', 'tables'
        ]
    
    def get_authors(self, obj):
        article_authors = obj.article_authors.order_by('author_order')
        return [
            {
                'name': aa.author.full_name,
                'affiliation': aa.affiliation,
                'is_corresponding': aa.is_corresponding
            }
            for aa in article_authors
        ]


class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating articles."""
    
    class Meta:
        model = Article
        fields = [
            'id', 'issue', 'title', 'slug', 'doi', 'article_type', 'status',
            'abstract', 'keywords',
            'page_start', 'page_end', 'article_number',
            'received_date', 'revised_date', 'accepted_date', 'published_date',
            'is_open_access', 'is_featured',
            'meta_title', 'meta_description'
        ]
        read_only_fields = ['id']


class ArticleAuthorBulkSerializer(serializers.Serializer):
    """Serializer for bulk updating article authors."""
    
    authors = serializers.ListField(
        child=serializers.DictField(),
        help_text='List of author objects with author_id, author_order, is_corresponding, etc.'
    )
    
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
                author_contribution=author_data.get('author_contribution', ''),
                affiliation_override=author_data.get('affiliation_override', '')
            )
        
        return article





