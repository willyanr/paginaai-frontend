from django.db import models
from django.contrib.auth.models import User

class LandingPageProject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    domain_verified = models.BooleanField(default=False)
    project_data = models.JSONField(default=dict)
    html = models.TextField(blank=True, null=True)
    css = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"


class Marketing(models.Model):
    project = models.ForeignKey(LandingPageProject, on_delete=models.CASCADE)
    pixel_meta = models.CharField(max_length=255, blank=True, null=True)
    pixel_utmify = models.CharField(max_length=255, blank=True, null=True)
    pixel_google = models.CharField(max_length=255, blank=True, null=True)
    pixel_google_ads = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.project.name}"
    

class Domain(models.Model):
    project = models.OneToOneField(LandingPageProject,
                                    on_delete=models.CASCADE,
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