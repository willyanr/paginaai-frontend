from django.utils import timezone
from django.shortcuts import render
from rest_framework import viewsets
from .models import LandingPageProject, Marketing, Domain, Pixel, ImageUpload, TestAB, Monitoring, Utms
from .serializers import LandingPageProjectSerializer, MarketingProjectsSerializer, DomainsProjectSerializer, PixelSerializer, ImageUploadSerializer, TestABSerializer, MonitoringSerializer, StatisticsSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, render
from .models import LandingPageProject
from django.views.decorators.clickjacking import xframe_options_exempt
from .domains.utils import verify_domain, verify_cname
from rest_framework.parsers import MultiPartParser, JSONParser
from django.http import Http404
from django.db.models import Q
from .tasks import determine_winner
from datetime import timedelta
from django.db.models import Count
from .utils.sanitize_user_html import sanitize_html




def landing_page_view(request):
    from collections import defaultdict
    host = request.get_host().split(':')[0]
    domain = get_object_or_404(Domain, domain=host, verified=False)
    project = domain.project 
    pixels = Pixel.objects.filter(project=project.id)

    context = defaultdict(list)

    if pixels.exists():
        for pixel in pixels:
            context[pixel.pixel_type].append(pixel.pixel_value)

    if not project:
        raise Http404("Projeto não encontrado para esse domínio.")
    
    return render(request, 'landing_page.html', {
        'html_content': sanitize_html(project.html),
        'css_content': project.css,
        **context  
    })



class LandingPageProjectViewSet(viewsets.ModelViewSet):
    serializer_class = LandingPageProjectSerializer
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        return LandingPageProject.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user_id = self.request.user.id
        name = request.data.get('name')
        description = request.data.get('description')
        project_data = request.data.get('project_data', {})
        project_id = request.data.get('id', None)
        html = request.data.get('html', '')
        css = request.data.get('css', '')

        queryset = self.get_queryset()
        existing_project = queryset.filter(name=name).first()

        if existing_project:
            if existing_project.user.id == user_id:
                return Response({"detail": "Projeto já existe com esse nome."}, status=400)

        project = LandingPageProject.objects.create(
            user_id=user_id,
            name=name,
            description=description,
            project_data=project_data,
            html=sanitize_html(html),
            css=css,
            created_at=timezone.now()
        )

        serializer = self.get_serializer(project)
        return Response(serializer.data, status=201)


            
        def update(self, request, *args, **kwargs):
            user_id = request.user.id
            try:
                instance = self.get_object()
                if instance.user_id != user_id:
                    return Response(
                        {"detail": "User not authorized to update this project."},
                        status=status.HTTP_403_FORBIDDEN
                    )

                return super().update(request, *args, **kwargs)

            except Exception as e:
                print("Erro no update:", e)
                return Response(
                    {"detail": "Error update project."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        def perform_update(self, serializer):
            html = self.request.data.get('html', '')
            serializer.save(
                user=self.request.user,
                html=sanitize_html(html)
            )


class MarketingProjectViewSet(viewsets.ModelViewSet):
    serializer_class = MarketingProjectsSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return Marketing.objects.filter(project__user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DomainsProjectsViewSet(viewsets.ModelViewSet):
    from rest_framework.decorators import action

    queryset = Domain.objects.all()
    serializer_class = DomainsProjectSerializer
    permission_classes = [IsAuthenticated]
    USER_TESTE  = 2

    def get_queryset(self):
        
        user = self.request.user
        return Domain.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            domain = request.data.get('domain')
            if verify_domain(domain):
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"detail": "Domínio não registrado."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=["post"])
    def verify(self, request):
        domain = request.data.get("domain", "").strip().lower()
        user = self.request.user
        if not domain:
            return Response({"detail": "Domínio não enviado."}, status=status.HTTP_400_BAD_REQUEST)
        
        domain_result = Domain.objects.filter(user=user, domain=domain).first()

        if not domain_result:
            return Response({"detail": "Domínio não pertence a este usuário."}, status=status.HTTP_403_FORBIDDEN)

        if verify_cname(domain):
            domain_result.verified = True
            domain_result.ssl_enabled = True
            domain_result.last_checked = timezone.now()
            if domain_result.project:
                domain_result.project.domain_verified = True
                domain_result.project.save()
            domain_result.save()

            return Response({"valid": True})
        else:
             return Response({"detail": "Não foi encontrado CNAME nos seus registros DNS."}, status=status.HTTP_403_FORBIDDEN)
        



class TestABViewSet(viewsets.ModelViewSet):
    
    serializer_class = TestABSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TestAB.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        project_1 = data.get('variant_a_project')
        project_2 = data.get('variant_b_project')
        user = request.user
        DETERMINE_TIME_TEST = timezone.localtime() + timedelta(hours=24)
        
        
        if TestAB.objects.filter(user=user).exists():
            return Response({'detail': 'Você já tem um teste ativo.'}, status=400)
        
        if TestAB.objects.filter(
            Q(variant_a_project=project_1, variant_b_project=project_2) |
            Q(variant_a_project=project_2, variant_b_project=project_1)
        ).exists():
            return Response({'detail': 'Um teste com essas duas variantes já existe.'}, status=400)


        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        created_instance = serializer.instance
        determine_winner.apply_async((created_instance.id, user.id), eta=DETERMINE_TIME_TEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    

class PixelViewSet(viewsets.ModelViewSet):
    queryset = Pixel.objects.all()
    serializer_class = PixelSerializer
    

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project')
        try:
            project = LandingPageProject.objects.get(id=project_id)
        except LandingPageProject.DoesNotExist:
            return Response({"error": "Projeto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        pixel_data = request.data
        pixel_data['project'] = project.id 
        serializer = self.get_serializer(data=pixel_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
   
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ImageUploadViewSet(viewsets.ModelViewSet):
        serializer_class = ImageUploadSerializer
        parser_classes = [MultiPartParser, JSONParser]
        
        def get_queryset(self):
            return ImageUpload.objects.filter(user=self.request.user)

        def create(self, request, *args, **kwargs):
            print('REQUEST DATA', request.data)
            try:
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                
                data = {
                    'data': {
                        'id': serializer.data['id'],
                        'url': serializer.data['url'],
                        'src': serializer.data['url'], 
                        'name': serializer.data.get('title', f"Image {serializer.data['id']}"),
                        'type': 'image',
                    }
                }
                
                return Response(data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("Error during image upload:", e)
                return Response({"detail": "Error during image upload."}, status=status.HTTP_400_BAD_REQUEST)
            
        def perform_create(self, serializer):
            serializer.save(user=self.request.user)


class ImageUploadViewSet(viewsets.ModelViewSet):
    serializer_class = ImageUploadSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]
    
    def get_queryset(self):
        return ImageUpload.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        images = []
        
        for instance in queryset:
            images.append({
                'src': request.build_absolute_uri(instance.image.url),
                'type': 'image',
                'name': instance.title,
                'height': 0, 
                'width': 0  
            })
        
        return Response({
            'data': images
        })
        
    def create(self, request, *args, **kwargs):
        files = request.FILES.getlist('image[]') 

        if not files:
            return Response({'error': 'Nenhuma imagem fornecida'}, status=400)

        created = []
        result = []
        for file in files:
            data = {
                'image': file,
                'title': file.name,
                'user': request.user.id
            }
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save(user=request.user)
            created.append(serializer.data)

            result.append({
            'src': request.build_absolute_uri(instance.image.url),
            'type': 'image',
            'name': instance.title,
            'height': 0, 
            'width': 0   
            })
            return Response({'data': result}, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class MonitoringViewSet(viewsets.ModelViewSet):
    serializer_class = MonitoringSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return Monitoring.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    


class StatisticsViewSet(viewsets.ViewSet):
    serializer_class = StatisticsSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        projects = LandingPageProject.objects.filter(user=user)
        domains = Domain.objects.filter(user=user)

        # Total stats
        data = {
            'total_domains': domains.count(),
            'total_projects': projects.count(),
            'total_views': sum(project.page_view for project in projects),
            'total_clicks': sum(project.button_cta_click for project in projects),
        }

        # UTM campaign mais comum
        top_utm_campaign = (
            Utms.objects.filter(user=user)
            .values('utm_campaign')
            .annotate(count=Count('utm_campaign'))
            .order_by('-count')
            .first()
        )

        data['top_utm_campaign'] = top_utm_campaign['utm_campaign'] if top_utm_campaign else None
        data['top_utm_campaign_count'] = top_utm_campaign['count'] if top_utm_campaign else 0
        data['utm_created'] =  top_utm_campaign.get('created_at') if top_utm_campaign else None

        serializer = StatisticsSerializer(data)
        return Response(serializer.data)
