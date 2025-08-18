# Usando imagem oficial do Python
FROM python:3.11-slim

RUN apt-get update \
    && apt-get install -y gcc default-libmysqlclient-dev pkg-config netcat-openbsd \
    && apt-get clean


# Configurações do Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Diretório de trabalho
WORKDIR /grapes_api

# Instala dependências do Python
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o entrypoint antes do resto
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta do Django
EXPOSE 8000

# Comando de entrada
ENTRYPOINT ["./entrypoint.sh"]
