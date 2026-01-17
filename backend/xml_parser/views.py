"""Views for XML processing."""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from articles.models import Article, ArticleFile, ArticleHTMLContent
from .services import XMLProcessingService, process_article_xml


class XMLUploadView(APIView):
    """
    Upload and process XML for an article.
    
    POST /api/v1/xml/upload/{article_id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, article_id):
        article = get_object_or_404(Article, pk=article_id)
        
        xml_file = request.FILES.get('file')
        if not xml_file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file type
        if not xml_file.name.lower().endswith('.xml'):
            return Response(
                {'error': 'File must be an XML file'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create ArticleFile record
        article_file = ArticleFile.objects.create(
            article=article,
            file_type='xml',
            file=xml_file,
            original_filename=xml_file.name,
            mime_type='application/xml',
            is_primary=True
        )
        
        # Process the XML
        service = XMLProcessingService(article)
        success = service.process_xml_file(article_file)
        
        if success:
            # Reload the HTML content
            html_content = article.html_content
            return Response({
                'success': True,
                'message': 'XML processed successfully',
                'parsing_status': html_content.parsing_status,
                'parsed_at': html_content.parsed_at
            })
        else:
            return Response({
                'success': False,
                'errors': service.errors,
                'parsing_status': 'failed'
            }, status=status.HTTP_400_BAD_REQUEST)


class XMLProcessView(APIView):
    """
    Process/re-process XML content for an article.
    
    POST /api/v1/xml/process/{article_id}/
    
    Can optionally include raw XML in the request body.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, article_id):
        article = get_object_or_404(Article, pk=article_id)
        
        xml_content = request.data.get('xml_content')
        
        result = process_article_xml(article_id, xml_content)
        
        if result['success']:
            html_content = article.html_content
            return Response({
                'success': True,
                'message': 'XML processed successfully',
                'parsing_status': html_content.parsing_status,
                'parsed_at': html_content.parsed_at
            })
        else:
            return Response({
                'success': False,
                'errors': result['errors']
            }, status=status.HTTP_400_BAD_REQUEST)


class XMLReparseView(APIView):
    """
    Re-parse stored XML for an article.
    
    POST /api/v1/xml/reparse/{article_id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request, article_id):
        article = get_object_or_404(Article, pk=article_id)
        
        service = XMLProcessingService(article)
        success = service.reparse()
        
        if success:
            html_content = article.html_content
            return Response({
                'success': True,
                'message': 'XML re-parsed successfully',
                'parsing_status': html_content.parsing_status,
                'parsed_at': html_content.parsed_at
            })
        else:
            return Response({
                'success': False,
                'errors': service.errors
            }, status=status.HTTP_400_BAD_REQUEST)


class XMLStatusView(APIView):
    """
    Get XML parsing status for an article.
    
    GET /api/v1/xml/status/{article_id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, article_id):
        article = get_object_or_404(Article, pk=article_id)
        
        try:
            html_content = article.html_content
            return Response({
                'has_xml': bool(html_content.original_xml),
                'parsing_status': html_content.parsing_status,
                'parsing_errors': html_content.parsing_errors,
                'parsed_at': html_content.parsed_at,
                'has_body': bool(html_content.body_html),
                'figure_count': len(html_content.figures_json) if html_content.figures_json else 0,
                'table_count': len(html_content.tables_json) if html_content.tables_json else 0,
            })
        except ArticleHTMLContent.DoesNotExist:
            return Response({
                'has_xml': False,
                'parsing_status': 'none',
                'parsing_errors': '',
                'parsed_at': None,
                'has_body': False,
                'figure_count': 0,
                'table_count': 0,
            })


class XMLPreviewView(APIView):
    """
    Preview parsed HTML content for an article.
    
    GET /api/v1/xml/preview/{article_id}/
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request, article_id):
        article = get_object_or_404(Article, pk=article_id)
        
        try:
            html_content = article.html_content
            return Response({
                'abstract_html': html_content.abstract_html,
                'body_html': html_content.body_html,
                'references_html': html_content.references_html,
                'acknowledgments_html': html_content.acknowledgments_html,
                'figures': html_content.figures_json,
                'tables': html_content.tables_json,
            })
        except ArticleHTMLContent.DoesNotExist:
            return Response({
                'error': 'No parsed content available'
            }, status=status.HTTP_404_NOT_FOUND)
