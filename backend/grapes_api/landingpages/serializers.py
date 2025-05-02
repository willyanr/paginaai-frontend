from rest_framework import serializers
from .models import LandingPageProject, Marketing


class MarketingProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketing
        fields = '__all__'

class LandingPageProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageProject
        fields = '__all__'
        extra_kwargs = {
            'user': {'required': False}  # <--- Make user field optional, if needed
        }




