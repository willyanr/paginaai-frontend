from rest_framework import serializers
from .models import LandingPageProject, Marketing, Domain, Pixel, ImageUpload, TestAB, Monitoring
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
        fields = ['id', 'project_name', 'domain', 'expected_cname', 'verified', 'ssl_enabled', 'created_at', 'last_checked']
        extra_kwargs = {
            'project': {'required': False, 'allow_null': True},
            'user': {'required': False}

        }




class PixelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pixel
        fields = ['id', 'pixel_type', 'pixel_value', 'project']


class MonitoringSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    class Meta:
        model = Monitoring
        fields = '__all__'
        extra_kwargs = {
            'user': {'required': False},
        }
           

class LandingPageProjectSerializer(serializers.ModelSerializer):
    domain = DomainsProjectSerializer(read_only=True)
    pixels = PixelSerializer(many=True, read_only=True)
    class Meta:
        model = LandingPageProject
        fields = ['id','name', 'description', 'domain_verified', 'project_data', 'html', 'css', 'created_at', 'updated_at', 'domain', 'pixels', 'page_view', 'button_cta_click']
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
    winner_project_name = serializers.CharField(source='winner_project.name', read_only=True)
    class Meta:
        model = TestAB
        fields = ['id','name', 'description', 'variant_a_project', 'variant_b_project', 'variant_a_project_name', 'variant_b_project_name', 'created_at', 'winner_project', 'winner_project_name']
        extra_kwargs = {
            'user': {'required': False}, 
            'winner_project': {'required': False}, 
        }
        

class StatisticsSerializer(serializers.Serializer):
    total_projects = serializers.IntegerField()
    total_views = serializers.IntegerField()
    total_clicks = serializers.IntegerField()
    total_domains = serializers.IntegerField()
    top_utm_campaign = serializers.CharField()
    top_utm_campaign_count = serializers.IntegerField()
    utm_created = serializers.DateTimeField()