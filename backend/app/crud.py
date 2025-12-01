from pydantic.v1.main import Model
from sqlalchemy.orm import Session
from . import models, schemas

def get_items(db: Session):
    return db.query(models.Item).all()

def create_item(db: Session, item_in: schemas.ItemCreate):
    item = models.Item(title=item_in.title, description=item_in.description)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def get_user(db: Session,username: str):
    return db.query(models.User).filter(models.User.username == username).first()
