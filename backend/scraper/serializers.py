from rest_framework import serializers
from .models import Search, Business

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            'id', 'business_id', 'name', 'email', 'website', 'phone',
            'address', 'category', 'rating', 'reviews_count',
            'email_sent_status', 'email_sent_date', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SearchSerializer(serializers.ModelSerializer):
    businesses = BusinessSerializer(many=True, read_only=True)
    
    class Meta:
        model = Search
        fields = ['id', 'query', 'timestamp', 'results_count', 'businesses']
        read_only_fields = ['id', 'timestamp', 'results_count'] 