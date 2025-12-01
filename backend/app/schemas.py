from pydantic import BaseModel

class ItemBase(BaseModel):
    title: str
    description: str | None = None

class ItemCreate(ItemBase):
    pass

class ItemRead(BaseModel):
    id: int
    title: str
    description: str | None = None

    model_config = {
        "from_attributes": True
    }

class UserBase(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    password: str