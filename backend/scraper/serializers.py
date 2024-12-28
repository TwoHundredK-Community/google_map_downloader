from rest_framework import serializers
from .models import Search, Business

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            'id', 'uuid', 'business_id', 'name', 'email', 'website', 'phone',
            'address', 'category', 'rating', 'reviews_count',
            'latitude', 'longitude', 'place_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uuid', 'created_at', 'updated_at']


class SearchSerializer(serializers.ModelSerializer):
    businesses = BusinessSerializer(many=True, read_only=True)
    
    class Meta:
        model = Search
        fields = [
            'id', 'query', 'timestamp', 'results_count', 
            'last_updated', 'businesses'
        ]
        read_only_fields = ['id', 'timestamp', 'last_updated', 'results_count'] 