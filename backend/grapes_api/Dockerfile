# Usando imagem oficial do Python
FROM python:3.11-slim

RUN apt-get update \
    && apt-get install -y gcc default-libmysqlclient-dev pkg-config \
    && apt-get clean

# Configurações do Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# Diretório de trabalho
WORKDIR /grapes_api

# Instala dependências do sistema



# Copia dependências e instala
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Expõe a porta do Django
EXPOSE 8000

# Comando padrão
CMD ["gunicorn", "grapes_api.wsgi:application", "--bind", "0.0.0.0:8000"]
