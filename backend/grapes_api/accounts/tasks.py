import traceback
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_otp_email(email, otp, cpf):
    """
    Tarefa Celery para enviar e-mail com código OTP
    """
    try:
        subject = "Seu código de verificação"
        message = f"""
        Olá!
        
        Seu código de verificação é: {otp}
        
        Este código é válido por 5 minutos.
        
        Atenciosamente,
        Equipe de Suporte
        """
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        logger.info(f"E-mail de verificação enviado para {email} com CPF: {cpf[-4:]}")
        return True
    except Exception as e:
        logger.error(f"Erro ao enviar e-mail para {email}: {str(e)}")
        logger.error("Detalhes do erro:\n" + traceback.format_exc())  # Exibe detalhes do erro
        return False
    


@shared_task
def send_otp_reset_user_email(email, otp):
    
    try:
        subject = "Seu código de verificação para resetar sua conta chegou!"
        message = f"""
        Olá!
        
        Seu código de verificação é: {otp}
        
        Este código é válido por 5 minutos, use para resetar sua senha.
        
        Atenciosamente,
        Equipe de Suporte
        """
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        return True
    except Exception as e:
        logger.error(f"Erro ao enviar e-mail para {email}: {str(e)}")
        logger.error("Detalhes do erro:\n" + traceback.format_exc())  # Exibe detalhes do erro
        return False
    
