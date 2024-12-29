from django.contrib import admin
from .models import Search, Business

@admin.register(Search)
class SearchAdmin(admin.ModelAdmin):
    list_display = ('id', 'query', 'user', 'results_count', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('query', 'user__email')
    ordering = ('-timestamp',)
    readonly_fields = ('timestamp', 'last_updated')
    filter_horizontal = ('shared_with',)

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'category', 'rating', 'created_at', 'place_id', 'instagram_link', 'youtube_link', 'twitter_link', 'facebook_link')
    list_filter = ('category', 'rating', 'created_at')
    search_fields = ('name', 'email', 'phone', 'address', 'place_id', 'uuid', 'instagram_link', 'youtube_link', 'twitter_link', 'facebook_link')
    ordering = ('-created_at',)
    readonly_fields = ('uuid', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('uuid', 'search', 'name', 'category', 'place_id')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'website', 'address')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Ratings & Reviews', {
            'fields': ('rating', 'reviews_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
