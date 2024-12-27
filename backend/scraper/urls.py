from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'scraper'

router = DefaultRouter()
router.register(r'searches', views.SearchViewSet, basename='search')
router.register(r'businesses', views.BusinessViewSet, basename='business')

urlpatterns = [
    path('', include(router.urls)),
] 