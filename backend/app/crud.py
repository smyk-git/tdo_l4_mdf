from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from . import models, schemas

def get_items(db: Session):
    return db.query(models.Item).all()

def create_item(db: Session, item_in: schemas.ItemCreate):
    item = models.Item(
        title=item_in.title,
        description=item_in.description,
        year=item_in.year,
        rating=item_in.rating,
        genre=item_in.genre,
        director=item_in.director,
        )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def update_item(db: Session, item_id: int, item_in: schemas.ItemUpdate):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    update_data = item_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, item_id: int):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}

def get_user(db: Session,username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session):
    return db.query(models.User).all()

def create_user(db: Session,user_in: schemas.UserCreate):
    user = models.User(username=user_in.username,password=pass_to_hash(user_in.password))

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db: Session, username: str, user_in: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.username == username).first()
    update_data = user_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, username: str):
    item = db.query(models.Item).filter(models.User.username == username).first()
    db.delete(item)
    db.commit()
    return {"message": "User deleted"}

hasher_instance = PasswordHash.recommended()
def pass_to_hash(password):
    return hasher_instance.hash(password)