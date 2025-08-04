from celery import shared_task
from .models import TestAB
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def determine_winner(test_id, user_id):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(pk=user_id)
        test = TestAB.objects.get(pk=test_id, user=user)
        a_clicks = test.variant_a_project.button_cta_click
        b_clicks = test.variant_b_project.button_cta_click

        if a_clicks > b_clicks:
            winner = test.variant_a_project
        elif b_clicks > a_clicks:
            winner = test.variant_b_project
        else:
            winner = None 

        test.winner_project = winner
        test.save()

        if winner:
            send_mail(
                'Seu Teste A/B foi concluído!',
                f'O projeto vencedor foi: {winner.name}',
                settings.DEFAULT_FROM_EMAIL,
                [test.user.email],
            )

    except TestAB.DoesNotExist:
        pass
