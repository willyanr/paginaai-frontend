from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from . import views

router = DefaultRouter()
router.register(r'projects', views.LandingPageProjectViewSet, basename='projects')
router.register(r'pixels', views.PixelViewSet, basename='pixel')
router.register(r'marketing', views.MarketingProjectViewSet, basename='marketing')
router.register(r'domains', views.DomainsProjectsViewSet, basename='domains')
router.register(r'images', views.ImageUploadViewSet, basename='images')
router.register(r'tests', views.TestABViewSet, basename='tests')
router.register(r'monitoring', views.MonitoringViewSet, basename='monitoring')

urlpatterns = [
    path('api/', include(router.urls)),
    path('', views.landing_page_view, name='landing_page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)