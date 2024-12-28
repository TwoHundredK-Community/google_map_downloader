import os
import googlemaps
from typing import List, Dict, Any
from django.conf import settings

class GoogleMapsService:
    """Service class for interacting with Google Maps API."""
    
    def __init__(self):
        """Initialize the Google Maps client."""
        self.client = googlemaps.Client(key=os.getenv('GOOGLE_MAPS_API_KEY'))
    
    def search_places(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for places using the provided query.
        
        Args:
            query: Search query string or Google Maps URL
        
        Returns:
            List of business details
        """
        # Extract query from Google Maps URL if provided
        if 'google.com/maps' in query:
            # TODO: Implement URL parsing logic
            pass
        
        # Perform the search
        places_result = self.client.places(query)
        businesses = []
        
        for place in places_result.get('results', []):
            # Get detailed information for each place
            place_details = self.client.place(place['place_id'])['result']
            
            business = {
                'business_id': place['place_id'],
                'name': place.get('name', ''),
                'place_id': place['place_id'],
                'address': place.get('formatted_address', ''),
                'phone': place_details.get('formatted_phone_number', ''),
                'website': place_details.get('website', ''),
                'rating': place.get('rating'),
                'reviews_count': place.get('user_ratings_total', 0),
                'latitude': place['geometry']['location']['lat'],
                'longitude': place['geometry']['location']['lng'],
                'category': place.get('types', [])[0] if place.get('types') else None,
            }
            
            businesses.append(business)
        
        return businesses 