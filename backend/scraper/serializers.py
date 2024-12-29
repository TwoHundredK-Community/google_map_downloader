from rest_framework import serializers
from .models import Search, Business

class SearchBasicSerializer(serializers.ModelSerializer):
    """Basic serializer for Search model without businesses field to avoid circular reference"""
    class Meta:
        model = Search
        fields = [
            'id', 'query', 'timestamp', 'results_count', 
            'last_updated'
        ]
        read_only_fields = ['id', 'timestamp', 'last_updated', 'results_count']

class BusinessSerializer(serializers.ModelSerializer):
    search_history = SearchBasicSerializer(many=True, read_only=True)
    
    class Meta:
        model = Business
        fields = [
            'id', 'uuid', 'name', 'email', 'website', 'phone',
            'address', 'category', 'rating', 'reviews_count',
            'latitude', 'longitude', 'place_id',
            'created_at', 'updated_at',
            'search_history'
        ]
        read_only_fields = ['id', 'uuid', 'created_at', 'updated_at']

class SearchSerializer(serializers.ModelSerializer):
    results = BusinessSerializer(many=True, read_only=True)
    
    class Meta:
        model = Search
        fields = [
            'id', 'query', 'timestamp', 'results_count', 
            'last_updated', 'results'
        ]
        read_only_fields = ['id', 'timestamp', 'last_updated', 'results_count'] 