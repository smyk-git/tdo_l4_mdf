from sqlalchemy import Column, Integer, String, Text
from .db import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    year = Column(Integer, nullable=True)
    director = Column(String(100), nullable=True)
    genre = Column(String(100), nullable=True)
    rating = Column(Integer, nullable=True)  # rating from 1 to 10



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True,index=True)
    username = Column(String(30),nullable=False,unique=True,index=True)
    password = Column(String(512),nullable=False)
