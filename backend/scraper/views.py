from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Search, Business
from .serializers import SearchSerializer, BusinessSerializer

class SearchViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing search queries and results.
    """
    serializer_class = SearchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Search.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BusinessViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing business data.
    """
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Business.objects.filter(search__user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_email_sent(self, request, pk=None):
        business = self.get_object()
        business.mark_email_sent()
        return Response({'status': 'email marked as sent'})
