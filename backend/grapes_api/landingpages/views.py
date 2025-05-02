from datetime import timezone
from django.shortcuts import render


from rest_framework import viewsets, permissions
from .models import LandingPageProject, Marketing
from .serializers import LandingPageProjectSerializer, MarketingProjectsSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from django.shortcuts import get_object_or_404, render
from .models import LandingPageProject

from django.views.decorators.clickjacking import xframe_options_exempt

@xframe_options_exempt
def landing_page_view(request):
    project = get_object_or_404(LandingPageProject, user_id=1)
    return render(request, 'landing_page.html', {
        'html_content': project.html,
        'css_content': project.css,
    })

class LandingPageProjectViewSet(viewsets.ModelViewSet):
    queryset = LandingPageProject.objects.all()
    serializer_class = LandingPageProjectSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return LandingPageProject.objects.filter(user=user)
        return KeyError


    def create(self, request, *args, **kwargs):
        user_id = self.request.user.id
        name = request.data.get('name')
        description = request.data.get('description')
        project_data = request.data.get('project_data', {})
        project_id = request.data.get('id', None)
        html = request.data.get('html', '')
        css = request.data.get('css', '')
      
        project = LandingPageProject.objects.filter(name=name).first()

        if project:
            user = user_id
            project.id = project_id
            project.name = name
            project.project_data = project_data
            project.html = html
            project.css = css
            updated_at = timezone.now();
            project.save()
        else:
            print('PROJECTO NAO ENCONTRADO')
            project = LandingPageProject.objects.create(
                user_id=user_id,
                name=name,
                description=description,
                project_data=project_data,
                html=html,
                css=css,
            )

        serializer = self.get_serializer(project)
        return Response(serializer.data, status=201)

        
    def update(self, request, *args, **kwargs):
        print("UPDATE METHOD CALLED")
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
        serializer.save(user=self.request.user)




class MarketingProjectViewSet(viewsets.ModelViewSet):
    serializer_class = MarketingProjectsSerializer
    # permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return Marketing.objects.filter(project__user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            marketing_project = serializer.save() 
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)