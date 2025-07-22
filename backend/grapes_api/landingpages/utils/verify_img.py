from PIL import Image
from django.core.files.images import get_image_dimensions
from rest_framework import serializers

def validate_image(image):
    max_file_size = 5 * 1024 * 1024
    if image.size > max_file_size:
        raise serializers.ValidationError("Imagem excede o tamanho máximo de 5MB.")

    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    if not any(image.name.lower().endswith(ext) for ext in valid_extensions):
        raise serializers.ValidationError("Formato de imagem não suportado.")

    try:
        img = Image.open(image)
        img.verify() 
        image.seek(0)  
        width, height = get_image_dimensions(image)
    except Exception:
        raise serializers.ValidationError("Arquivo de imagem inválido.")

    max_width = 4000
    max_height = 4000
    if width > max_width or height > max_height:
        raise serializers.ValidationError("Resolução de imagem muito alta.")

    return image
