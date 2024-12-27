from django.db import models
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Search, Business
from .serializers import SearchSerializer, BusinessSerializer

User = get_user_model()

class SearchViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing search queries and results.
    """
    serializer_class = SearchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Get searches for the current user, including those shared with them.
        """
        return Search.objects.filter(
            models.Q(user=self.request.user) | 
            models.Q(shared_with=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        """Create a new search for the current user."""
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        operation_description="Share a search with other users",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_emails': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING),
                    description="List of user emails to share with"
                )
            }
        )
    )
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Share a search with other users by email."""
        search = self.get_object()
        user_emails = request.data.get('user_emails', [])
        
        # Get users by email
        users = User.objects.filter(email__in=user_emails)
        search.shared_with.add(*users)
        
        return Response({'status': 'search shared'})


class BusinessViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing business data.
    """
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['category', 'rating']
    search_fields = ['name', 'email', 'phone', 'address']
    ordering_fields = ['name', 'rating', 'created_at']

    def get_queryset(self):
        """
        Get businesses from searches owned by or shared with the current user.
        """
        return Business.objects.filter(
            search__in=Search.objects.filter(
                models.Q(user=self.request.user) | 
                models.Q(shared_with=self.request.user)
            )
        ).distinct()

    @swagger_auto_schema(
        operation_description="Export selected businesses data",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'business_ids': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING),
                    description="List of business UUIDs to export"
                ),
                'format': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['csv', 'xlsx'],
                    description="Export format"
                )
            }
        )
    )
    @action(detail=False, methods=['post'])
    def export(self, request):
        """Export selected businesses to CSV or Excel."""
        business_ids = request.data.get('business_ids', [])
        export_format = request.data.get('format', 'csv')
        
        businesses = self.get_queryset().filter(uuid__in=business_ids)
        
        # TODO: Implement export functionality
        return Response({'status': 'export initiated'})
