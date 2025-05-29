from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, RegisterViewSet, ValidateOTPViewSet
from .views import LoginView, ResetPasswordUserView

router = DefaultRouter()
router.register(r'profile', ProfileViewSet , basename='profile')
router.register('register', RegisterViewSet, basename='register')
router.register(r'validate-otp', ValidateOTPViewSet, basename='validate-otp')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('reset-password/', ResetPasswordUserView.as_view(), name='reset-user-password'),
    
  
]
