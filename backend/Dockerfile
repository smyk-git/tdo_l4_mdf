FROM python:3.12-slim

WORKDIR /app

# Zależności systemowe (np. psycopg)
RUN apt-get update && apt-get install -y build-essential netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
# COPY .env .

COPY alembic.ini .
COPY alembic ./alembic

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--reload", "--port", "8000"]

