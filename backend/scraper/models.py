from django.db import models
from django.conf import settings
import uuid

class Search(models.Model):
    """Model to track search queries and their results."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='searches'
    )
    shared_with = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='shared_searches',
        blank=True,
        help_text='Users who have access to this search'
    )
    query = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    results_count = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'searches'
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.query}"


class Business(models.Model):
    """Model to store business information from Google Maps."""
    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        help_text='Unique identifier for the business'
    )
    search = models.ForeignKey(
        Search,
        on_delete=models.CASCADE,
        related_name='businesses'
    )
    business_id = models.CharField(
        max_length=100,
        unique=True,
        help_text='Unique identifier from Google Maps'
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True
    )
    reviews_count = models.IntegerField(default=0)
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    place_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text='Google Maps Place ID'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'businesses'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['business_id']),
            models.Index(fields=['search']),
            models.Index(fields=['uuid']),
        ]

    def __str__(self):
        return self.name
