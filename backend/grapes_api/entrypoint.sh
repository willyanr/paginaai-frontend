#!/bin/sh

echo "Esperando o banco de dados ficar disponível..."
# Aguarda o banco de dados (pode usar outro método se quiser)
while ! nc -z db 3306; do
  sleep 1
done

echo "Aplicando migrações..."
python manage.py migrate

echo "Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "Iniciando o Gunicorn..."
exec gunicorn grapes_api.wsgi:application --bind 0.0.0.0:8000
