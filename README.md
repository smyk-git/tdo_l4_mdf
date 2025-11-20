# tdo_l4_mdf
# FastAPI + React + PostgreSQL Demo

### Struktura:

- `backend/` – FastAPI + SQLAlchemy
- `frontend/` – React (Vite)
- `docker-compose.yml` – PostgreSQL

## Uruchomienie

###  1. Baza (PostgreSQL):

```bash
docker compose up -d db
```

### 2. Backend (FastAPI):
```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
### 3. Frontend (React):
```
cd frontend
npm install
npm run dev
```

## Testowanie commitow
### Filip
```
Dodaje commit o zmianie w README.md
```
