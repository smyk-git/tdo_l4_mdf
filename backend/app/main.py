from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from prometheus_fastapi_instrumentator import Instrumentator

from datetime import timedelta, timezone, datetime
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from crud import get_user
from functions import validate_user, create_access_token, get_current_user
from schemas import TokenData, Token
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

Instrumentator().instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)

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
def create_item(item: schemas.ItemCreate, db_session: Session = Depends(db.get_db),current_user = Depends(get_current_user)):
    return crud.create_item(db_session, item)

@app.get("/db-check")
def db_check(db: Session = Depends(db.get_db)):
    try:
        db.execute(text("SELECT * from items"))
        return {"status": "OK", "message": "Connection to DB works!", "entities": crud.get_items(db)}
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}

@app.put("/items/{item_id}", response_model=schemas.ItemRead)
def update_item(item_id: int, item: schemas.ItemUpdate, db_session: Session = Depends(db.get_db), current_user = Depends(get_current_user)):
    return crud.update_item(db_session, item_id, item)

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db_session: Session = Depends(db.get_db), current_user = Depends(get_current_user)):
    return crud.delete_item(db_session, item_id)


ACCESS_TOKEN_EXPIRE_MINUTES = 30
@app.post("/login")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = validate_user(db.get_db(), form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")