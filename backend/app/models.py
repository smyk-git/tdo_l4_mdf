from sqlalchemy import Column, Integer, String, Text
from .db import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True,index=True)
    username = Column(String(30),nullable=Falses,unique=True,index=True)
    password = Column(String(512),nullable=False)
