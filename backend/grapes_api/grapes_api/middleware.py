# from django.utils.deprecation import MiddlewareMixin
# import bleach
# import json

# class SanitizeInputMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         if request.method in ['POST', 'PUT', 'PATCH']:
#             # Trabalha com a cópia mutável de request.POST
#             if request.POST:
#                 mutable_post = request.POST.copy()  # Cria uma cópia mutável
#                 for key, value in mutable_post.items():
#                     if isinstance(value, str):
#                         mutable_post[key] = bleach.clean(value, tags=[], attributes={}, strip=True)
#                 request.POST = mutable_post  # Substitui o request.POST imutável pela cópia modificada
            
#             # Se a requisição for no formato JSON (ex: PUT/PATCH com JSON)
#             elif request.body:
#                 try:
#                     data = json.loads(request.body)
#                     if isinstance(data, dict):
#                         for key, value in data.items():
#                             if isinstance(value, str):
#                                 data[key] = bleach.clean(value, tags=[], attributes={}, strip=True)
#                         request._body = json.dumps(data).encode('utf-8')  # Atualiza o corpo da requisição com os dados sanitizados
#                 except json.JSONDecodeError:
#                     pass

#         return None
