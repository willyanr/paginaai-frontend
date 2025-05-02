from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    whatsapp = models.CharField(max_length=20)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    cnpj = models.CharField(max_length=18)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=2, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    how_did_you_hear_about_us = models.CharField(
        max_length=50,
        choices=[
            ('google', 'Google'),
            ('instagram', 'Instagram'),
            ('facebook', 'Facebook'),
            ('friend', 'Indicação'),
            ('other', 'Outros'),
        ],
        blank=True,
        null=True
    )