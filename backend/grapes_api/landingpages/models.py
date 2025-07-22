from django.db import models
from django.conf import settings
from django.utils.text import slugify
import os
import uuid


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('uploads', filename)

class ImageUpload(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_file_path)
    title = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title or f"Image {self.id}"

class LandingPageProject(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    domain_verified = models.BooleanField(default=False)
    project_data = models.JSONField(default=dict)
    html = models.TextField(blank=True, null=True)
    css = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name='unique_user_project_name')
        ]

    def __str__(self):
        return f"{self.name}"


class Pixel(models.Model):
    TYPE_CHOICES = [
        ('meta', 'Meta'),
        ('google', 'Google'),
        ('google_ads', 'Google Ads'),
        ('utmify', 'Utmify'),
    ]
    project = models.ForeignKey(LandingPageProject, related_name='pixels', on_delete=models.CASCADE)
    pixel_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    pixel_value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.pixel_type} Pixel for {self.project.name}"

class Marketing(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    project = models.ForeignKey(LandingPageProject, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.project.name}"
    


class TestAB(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    variant_a_project = models.ForeignKey(
        LandingPageProject, on_delete=models.CASCADE, related_name='testab_variant_a'
    )
    variant_b_project = models.ForeignKey(
        LandingPageProject, on_delete=models.CASCADE, related_name='testab_variant_b'
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    winner_variant = models.CharField(
        max_length=1,
        choices=[('A', 'Variant A'), ('B', 'Variant B')],
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - A: {self.variant_a_project.name} | B: {self.variant_b_project.name}"


class Domain(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    project = models.OneToOneField(LandingPageProject,
                                    on_delete=models.SET_NULL,
                                    blank=True,
                                    null=True)
    domain = models.CharField(max_length=255, unique=True, blank=True, null=True)
    expected_cname = models.CharField(max_length=255, default='meudominio.com')
    verified = models.BooleanField(default=False)
    ssl_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_checked = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.domain
    

class Monitoring(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    project = models.ForeignKey(LandingPageProject,
                                    on_delete=models.CASCADE,
                                    blank=True,
                                    null=True)
    code_clarity = models.CharField(max_length=255, unique=True, blank=True, null=True)