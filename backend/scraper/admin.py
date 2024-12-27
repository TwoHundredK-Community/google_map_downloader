from django.contrib import admin
from .models import Search, Business

@admin.register(Search)
class SearchAdmin(admin.ModelAdmin):
    list_display = ('query', 'user', 'results_count', 'is_completed', 'timestamp')
    list_filter = ('is_completed', 'timestamp')
    search_fields = ('query', 'user__username', 'uuid')
    ordering = ('-timestamp',)
    readonly_fields = ('uuid', 'timestamp', 'last_updated')
    filter_horizontal = ('shared_with',)

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'category', 'rating', 'created_at')
    list_filter = ('category', 'rating', 'created_at')
    search_fields = ('name', 'email', 'phone', 'address', 'business_id', 'place_id', 'uuid')
    ordering = ('-created_at',)
    readonly_fields = ('uuid', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('uuid', 'search', 'name', 'category', 'business_id', 'place_id')
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
