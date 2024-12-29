from django.db import models, transaction
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Search, Business
from .serializers import SearchSerializer, BusinessSerializer
from .services import GoogleMapsService

User = get_user_model()

class CustomPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

class SearchViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing search queries and results.
    """
    serializer_class = SearchSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_queryset(self):
        """
        Get searches for the current user, including those shared with them.
        """
        return Search.objects.filter(
            models.Q(user=self.request.user) | 
            models.Q(shared_with=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        """
        Create a new search and fetch results from Google Maps.
        
        This method:
        1. Creates a new search record
        2. Calls Google Maps API to get business data
        3. Creates business records for each result
        4. Updates the search with result count
        """
        try:
            with transaction.atomic():
                # Create the search record
                search = serializer.save(user=self.request.user)
                
                # Initialize Google Maps service
                maps_service = GoogleMapsService()
                
                # Get search results
                businesses = maps_service.search_places(search.query)
                
                # Create business records
                business_objects = []
                for business_data in businesses:
                    business = Business(
                        search=search,
                        **business_data
                    )
                    business_objects.append(business)
                
                # Bulk create businesses
                if business_objects:
                    Business.objects.bulk_create(business_objects)
                
                # Update search with results count
                search.results_count = len(business_objects)
                search.results.set(business_objects)
                search.save()

                # Return paginated results
                page = self.paginate_queryset(business_objects)
                if page is not None:
                    serializer = BusinessSerializer(page, many=True)
                    return self.get_paginated_response(serializer.data)

                serializer = BusinessSerializer(business_objects, many=True)
                return Response(serializer.data)
                
        except Exception as e:
            # Log the error (you should configure proper logging)
            print(f"Error in perform_create: {str(e)}")
            # Re-raise the exception to be handled by DRF
            raise

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
