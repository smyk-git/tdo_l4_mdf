from pydantic import BaseModel
from typing import Optional
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from . import db, models, schemas, crud

app = FastAPI(title="FastAPI + React + Postgres demo")

# CORS – pozwalamy na requesty z frontu (Vite)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # skąd wolno
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, itd.
    allow_headers=["*"],          # wszystkie nagłówki
)

models.Base.metadata.create_all(bind=db.engine)

class ItemsCreate(BaseModel):
    title: str
    description: Optional[str] = None
    
class ItemsRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None

    class Config:
        orm_mode = True
        
@app.on_event("startup")
def on_startup():
    db.init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/items", response_model=list[schemas.ItemRead])
def list_items(db_session: Session = Depends(db.get_db)):
    return crud.get_items(db_session)

@app.post("/items", response_model=schemas.ItemRead)
def create_item(item: schemas.ItemCreate, db_session: Session = Depends(db.get_db)):
    return crud.create_item(db_session, item)

@app.get("/db-check")
def db_check(db: Session = Depends(db.get_db)):
    try:
        db.execute(text("SELECT * from items"))
        return {"status": "OK", "message": "Connection to DB works!", "entities": crud.get_items(db)}
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}