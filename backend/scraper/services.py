import os
import re
import requests
import googlemaps
from typing import List, Dict, Any, Optional
from django.conf import settings

class GoogleMapsService:
    """Service class for interacting with Google Maps API."""
    
    def __init__(self):
        """Initialize the Google Maps client."""
        self.client = googlemaps.Client(key=os.getenv('GOOGLE_MAPS_API_KEY'))
    
    def extract_email_from_website(self, website_url: str) -> Optional[str]:
        """Extract email from website content."""
        if not website_url:
            return None
            
        try:
            # Add http:// if not present
            if not website_url.startswith(('http://', 'https://')):
                website_url = 'https://' + website_url
                
            response = requests.get(website_url, timeout=10)
            if response.status_code != 200:
                return None
                
            # Find email using regex
            email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
            emails = re.findall(email_pattern, response.text)
            
            # Filter out common false positives
            filtered_emails = [
                email for email in emails 
                if not any(false_positive in email.lower() 
                          for false_positive in ['example.com', 'domain.com'])
            ]
            
            return filtered_emails[0] if filtered_emails else None
            
        except Exception:
            return None
    
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
            
            website = place_details.get('website', '')
            email = self.extract_email_from_website(website)
            
            # Extract social media links if available in the place details
            social_links = {
                'instagram_link': None,
                'youtube_link': None,
                'twitter_link': None,
                'facebook_link': None
            }
            
            # Check for social media in website or other URLs
            if website:
                website_lower = website.lower()
                if 'instagram.com' in website_lower:
                    social_links['instagram_link'] = website
                elif 'youtube.com' in website_lower or 'youtu.be' in website_lower:
                    social_links['youtube_link'] = website
                elif 'twitter.com' in website_lower or 'x.com' in website_lower:
                    social_links['twitter_link'] = website
                elif 'facebook.com' in website_lower:
                    social_links['facebook_link'] = website
            
            business = {
                'name': place.get('name', ''),
                'place_id': place['place_id'],
                'address': place.get('formatted_address', ''),
                'phone': place_details.get('formatted_phone_number', ''),
                'website': website,
                'email': email,
                'rating': place.get('rating'),
                'reviews_count': place.get('user_ratings_total', 0),
                'latitude': place['geometry']['location']['lat'],
                'longitude': place['geometry']['location']['lng'],
                'category': place.get('types', [])[0] if place.get('types') else None,
                **social_links  # Include social media links
            }
            
            businesses.append(business)
        
        return businesses 