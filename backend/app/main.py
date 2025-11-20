from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import db, models, schemas, crud

app = FastAPI(title="FastAPI + React + Postgres demo")

# CORS – pozwalamy na requesty z frontu (Vite)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # skąd wolno
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, itd.
    allow_headers=["*"],          # wszystkie nagłówki
)

models.Base.metadata.create_all(bind=db.engine)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/items", response_model=list[schemas.ItemRead])
def list_items(db_session: Session = Depends(db.get_db)):
    return crud.get_items(db_session)

@app.post("/items", response_model=schemas.ItemRead)
def create_item(item: schemas.ItemCreate, db_session: Session = Depends(db.get_db)):
    return crud.create_item(db_session, item)
