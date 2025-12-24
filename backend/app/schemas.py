from pydantic import BaseModel
from typing import Optional

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    year: Optional[int] = None
    rating: Optional[int] = None
    genre: Optional[str] = None
    director: Optional[str] = None


class ItemCreate(ItemBase):
    # /items POST payload from frontend
    pass

class ItemRead(BaseModel):
    id: int
    title: str
    description: str | None = None
    year: Optional[int] = None
    rating: Optional[int] = None
    genre: Optional[str] = None
    director: Optional[str] = None

    model_config = {
        "from_attributes": True
    }

class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    year: Optional[int] = None
    rating: Optional[int] = None
    genre: Optional[str] = None
    director: Optional[str] = None

class UserBase(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    password: str

class UserCreate(UserBase):
    pass # /items POST payload from frontend

class UserUpdate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None