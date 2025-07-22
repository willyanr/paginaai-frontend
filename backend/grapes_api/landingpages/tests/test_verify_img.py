import io
import unittest
from PIL import Image as PilImage
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import serializers
from landingpages.utils import verify_img
from django.test import TestCase

def create_test_image(format='PNG'):
    file = io.BytesIO()
    image = PilImage.new('RGB', (100, 100), color='red')
    image.save(file, format)
    file.name = f'test_image.{format.lower()}'
    file.seek(0)
    return SimpleUploadedFile(file.name, file.read(), content_type=f'image/{format.lower()}')

def create_corrupted_image():
    file = io.BytesIO(b'not a real image')
    file.name = 'corrupted.png'
    file.seek(0)
    return SimpleUploadedFile(file.name, file.read(), content_type='image/png')

def create_fake_text_file():
    file = io.BytesIO(b'This is a text file pretending to be an image.')
    file.name = 'fake.jpg'
    file.seek(0)
    return SimpleUploadedFile(file.name, file.read(), content_type='image/jpeg')

class VerifyImageTestCase(TestCase):
    def test_valid_image(self):
        img = create_test_image()
        try:
            result = verify_img(img)
            self.assertEqual(result, img)
        except serializers.ValidationError:
            self.fail("verify_img() levantou ValidationError para uma imagem válida.")

    def test_corrupted_image(self):
        corrupted_img = create_corrupted_image()
        with self.assertRaises(serializers.ValidationError):
            verify_img(corrupted_img)

    def test_fake_text_as_image(self):
        fake_img = create_fake_text_file()
        with self.assertRaises(serializers.ValidationError):
            verify_img(fake_img)

if __name__ == '__main__':
    unittest.main()
