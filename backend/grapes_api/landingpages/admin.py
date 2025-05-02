from django.contrib import admin
from . import models as landingpages
from django.contrib.admin import ModelAdmin, register

# Register your models here.
admin.site.site_header = "Grapes Admin"
admin.site.site_title = "Grapes Admin Portal"

admin.site.register([landingpages.LandingPageProject,
                     landingpages.Marketing,
                     landingpages.Domain])