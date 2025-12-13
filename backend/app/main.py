from pydantic import BaseModel, ConfigDict
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from . import db, schemas, crud

# CORS – pozwalamy na requesty z frontu (Vite)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    print("db start")
    yield
    print("db stop")

app = FastAPI(title="FastAPI + React + Postgres demo", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # skąd wolno
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, itd.
    allow_headers=["*"],          # wszystkie nagłówki
)


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

@app.put("/items/{item_id}", response_model=schemas.ItemRead)
def update_item(item_id: int, item: schemas.ItemUpdate, db_session: Session = Depends(db.get_db)):
    return crud.update_item(db_session, item_id, item)

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db_session: Session = Depends(db.get_db)):
    return crud.delete_item(db_session, item_id)


# @app.get("/users/{username}",response_model=schemas.UserRead)
# def read_user(username: str, db_session: Session = Depends(db.get_db)):
#     return crud.get_user(db_session,username)
