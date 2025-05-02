from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, render
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework import viewsets

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    # permission_classes = [IsAuthenticated]

    