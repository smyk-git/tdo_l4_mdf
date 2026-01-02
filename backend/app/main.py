from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import text
from prometheus_fastapi_instrumentator import Instrumentator

from datetime import timedelta
from typing import Annotated

from sqlalchemy.orm import Session

from .functions import validate_user, create_access_token, get_current_user
from .schemas import Token, UserCreate
from . import db, schemas, crud
from .models import User 

from pwdlib import PasswordHash

hasher_instance = PasswordHash.recommended()



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
def create_item(item: schemas.ItemCreate, db_session: Session = Depends(db.get_db), current_user = Depends(get_current_user)):
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
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],db_session: Session = Depends(db.get_db)) -> Token:
    user = validate_user(db_session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect username or password",headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return Token(access_token=access_token, token_type="bearer")

# New user registration
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(db.get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed =  hasher_instance.hash(user.password)
    new_user = User(username=user.username, password=hashed)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created"}


@app.get("/users", response_model=list[schemas.UserRead])
def list_users(db_session: Session = Depends(db.get_db)):
    return crud.get_users(db_session)

@app.post("/users", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db_session: Session = Depends(db.get_db), current_user = Depends(get_current_user)):
    return crud.create_user(db_session, user)

@app.put("/users/{username}", response_model=schemas.UserRead)
def update_user(username: str, user: schemas.UserUpdate, db_session: Session = Depends(db.get_db), current_user = Depends(get_current_user)):
    return crud.update_user(db_session, username, user)

@app.delete("/users/{username}")
def delete_user(username: str, db_session: Session = Depends(db.get_db), current_user = Depends(get_current_user)):
    return crud.delete_user(db_session, username)



