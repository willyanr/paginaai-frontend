from rest_framework import serializers
from .models import LandingPageProject, Marketing, Domain, Pixel, ImageUpload, TestAB
from .utils import verify_img

class MarketingProjectsSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    class Meta:
        model = Marketing
        fields = '__all__'
        extra_kwargs = {
            'user': {'required': False},
        }


class DomainsProjectSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    class Meta:
        model = Domain
        fields = '__all__'
        extra_kwargs = {
            'project': {'required': False, 'allow_null': True},
            'user': {'required': False}

        }




class PixelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pixel
        fields = ['id', 'pixel_type', 'pixel_value', 'project']
        

class LandingPageProjectSerializer(serializers.ModelSerializer):
    domain = DomainsProjectSerializer(read_only=True)
    pixels = PixelSerializer(many=True, read_only=True)
    class Meta:
        model = LandingPageProject
        fields = '__all__'
        extra_kwargs = {
            'user': {'required': False},  # <--- Make user field optional, if needed
            'name': {'required': False}
        }

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request else None
        domain = attrs.get('domain')

        if domain and LandingPageProject.objects.filter(domain=domain).exists():
            raise serializers.ValidationError({
                'project': [_("Este domínio já está vinculado a um projeto.")]
            })

        return super().validate(attrs)


class ImageUploadSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField(validators=[verify_img])
    
    class Meta:
        model = ImageUpload
        fields = ['id', 'title', 'image', 'url', 'uploaded_at']
        extra_kwargs = {
            'user': {'required': False}, 
        }
    
    def get_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None
    
class TestABSerializer(serializers.ModelSerializer):
    variant_a_project_name = LandingPageProjectSerializer(source='variant_a_project', read_only=True)
    variant_b_project_name = LandingPageProjectSerializer(source='variant_b_project', read_only=True)
    class Meta:
        model = TestAB
        fields = '__all__'
        