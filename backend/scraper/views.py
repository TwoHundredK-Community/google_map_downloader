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
        """
        try:
            with transaction.atomic():
                # Create the search record
                search = serializer.save(user=self.request.user)
                
                # Initialize Google Maps service
                maps_service = GoogleMapsService()
                
                # Get search results
                businesses_data = maps_service.search_places(search.query)
                
                # Lists to store new and existing businesses
                new_business_objects = []
                existing_businesses = []
                
                # Get existing businesses with place_ids from the new results
                place_ids = [data['place_id'] for data in businesses_data]
                existing_business_map = {
                    b.place_id: b for b in Business.objects.filter(place_id__in=place_ids)
                }
                
                # Process each business
                for business_data in businesses_data:
                    existing_business = existing_business_map.get(business_data['place_id'])
                    
                    if existing_business:
                        # Add the new search to the existing business's search history
                        existing_business.search_history.add(search)
                        existing_businesses.append(existing_business)
                    else:
                        # Create new business
                        new_business = Business(
                            search=search,
                            **business_data
                        )
                        new_business_objects.append(new_business)
                
                # Bulk create new businesses
                created_businesses = []
                if new_business_objects:
                    created_businesses = Business.objects.bulk_create(new_business_objects)
                    # Add the search to search_history for new businesses
                    for business in created_businesses:
                        business.search_history.add(search)
                
                # Combine all businesses for the response and refresh from db
                all_businesses = list(Business.objects.filter(
                    models.Q(id__in=[b.id for b in created_businesses]) |
                    models.Q(id__in=[b.id for b in existing_businesses])
                ).select_related('search').prefetch_related('search_history'))
                
                # Update search with results count
                search.results_count = len(all_businesses)
                search.results.set(all_businesses)
                search.save()

                # Return paginated results
                page = self.paginate_queryset(all_businesses)
                if page is not None:
                    serializer = BusinessSerializer(page, many=True)
                    return self.get_paginated_response(serializer.data)

                serializer = BusinessSerializer(all_businesses, many=True)
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
