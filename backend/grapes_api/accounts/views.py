from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, render
from .models import Profile, CustomUser
from .serializers import ProfileSerializer, RegisterSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from rest_framework import status
from rest_framework.views import APIView
import json
import random
import redis
from .tasks import send_otp_email, send_otp_reset_user_email

r = redis.Redis(host='api_redis', port=6379, db=0)



class ResetPasswordUserView(APIView):
    def post(self, request):
        user_email = request.data.get('email')
        code_otp = request.data.get('otp')

        if not code_otp:
            if not user_email:
                return Response(
                    {"error": "E-mail é obrigatório"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user_exist = CustomUser.objects.filter(email=user_email).exists()
            print('olha o email', user_email)
            if not user_exist:
                return Response(
                    {"error": "Erro interno"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                otp = random.randint(100000, 999999)
                r.hset(otp, mapping={
                    "email": user_email,
                    "otp": otp,
                    "reset_allowed": "false"
                })
                
                
                send_otp_reset_user_email(
                    user_email,
                    otp,
                )
                return Response({"otp": otp, "message": "Dados temporários salvos. Confirme com o OTP."})
            except:
                return Response(
                            {"error": "Houve um erro"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
        
        redis_data = r.hgetall(code_otp)
        if not redis_data:
            return Response(
                {"error": "Registro temporário não encontrado ou expirado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        stored_otp = r.hget(code_otp, "otp")

        if stored_otp.decode('utf-8') != str(code_otp):
            return Response(
                {"error": "Código invalido"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        r.hset(code_otp, "reset_allowed", "true")
        return Response(
                {"error": "Código validade com sucesso!"},
                status=status.HTTP_200_OK
            )
    
    def put(self, request):
        code_otp = request.data.get("otp")
        new_password = request.data.get("password")

        try:
            redis_data = r.hget(code_otp, "otp")
        except Exception as e:
            return Response(
                {"error": "Erro interno ao acessar Redis"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if not redis_data:
            return Response(
                {"error": "Registro temporário não encontrado ou expirado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_allowed = r.hget(code_otp, "reset_allowed")
        except Exception as e:
            return Response(
                {"error": "Erro ao verificar permissão de reset"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if reset_allowed != b"true":
            return Response(
                {"error": "Reset de senha não autorizado para este código."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            user_email = r.hget(code_otp, "email")

            if not user_email:
                return Response(
                    {"error": "E-mail associado não encontrado."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = CustomUser.objects.get(email=user_email.decode())
            user.set_password(new_password)
            user.save()

            r.delete(code_otp)

            return Response(
                {"message": "Senha alterada com sucesso."},
                status=status.HTTP_200_OK
            )

        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Erro interno ao alterar senha."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Erro nas credenciais'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterViewSet(viewsets.ModelViewSet):
    
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    http_method_names = ['post'] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
           
            temp_cpf = serializer.validated_data['profile']['cpf']
            temp_email = serializer.validated_data['email']
            otp = random.randint(100000, 999999)
            redis_key = f"Temp Register:{temp_cpf}"

            redis_data = {
                "data": serializer.validated_data, 
                "otp": otp
            }

            r.setex(redis_key, 300, json.dumps(redis_data))
            
            send_otp_email(
                temp_email,
                otp,
                temp_cpf
            )
            return Response({"otp": otp, "message": "Dados temporários salvos. Confirme com o OTP."})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ValidateOTPViewSet(viewsets.ViewSet):
    """
    ViewSet para validar o OTP e criar o usuário caso seja válido.
    Implementa um sistema de tentativas com bloqueio temporário.
    """
    MAX_ATTEMPTS = 3
    BLOCK_DURATION = 300 

    def create(self, request):
        cpf = request.data.get('cpf')
        input_otp = request.data.get('otp')
        email = request.data.get('email')

        if not cpf or not input_otp:
            return Response(
                {"error": "Código obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        redis_key = f"Temp Register:{cpf}"
        attempts_key = f"OTP Attempts:{email}"
        block_key = f"OTP Blocked:{email}"

        if r.exists(block_key):
            remaining_time = r.ttl(block_key)
            return Response(
                {"error": f"Muitas tentativas inválidas. Tente novamente em {remaining_time} segundos."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        redis_data_str = r.get(redis_key)

        if not redis_data_str:
            return Response(
                {"error": "Registro temporário não encontrado ou expirado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            redis_data = json.loads(redis_data_str)
        except json.JSONDecodeError:
            return Response(
                {"error": "Erro ao decodificar dados temporários"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        stored_otp = redis_data.get('otp')
        if str(input_otp) != str(stored_otp):
            attempts = r.incr(attempts_key)
            r.expire(attempts_key, self.BLOCK_DURATION) 

            if attempts >= self.MAX_ATTEMPTS:
                r.setex(block_key, self.BLOCK_DURATION, 1)
                return Response(
                    {"error": f"Código inválido. Você excedeu o número de tentativas. Tente novamente em {self.BLOCK_DURATION // 60} minutos."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            else:
                remaining_attempts = self.MAX_ATTEMPTS - attempts
                return Response(
                    {"error": f"Código inválido. Você tem mais {remaining_attempts} tentativa(s)."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        try:
            serializer = RegisterSerializer(data=redis_data['data'])
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = serializer.save()
            r.delete(redis_key)
            r.delete(attempts_key)  
            r.delete(block_key)     
            return Response(
                {"message": "Usuário registrado com sucesso!"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": f"Erro ao criar usuário: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
