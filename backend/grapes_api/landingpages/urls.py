from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LandingPageProjectViewSet, MarketingProjectViewSet
from . import views
router = DefaultRouter()
router.register(r'projects', LandingPageProjectViewSet, basename='projects')
router.register(r'marketing', MarketingProjectViewSet, basename='marketing')

urlpatterns = [
    path('', include(router.urls)),
    path('landing-page/', views.landing_page_view, name='landing_page'),
]
