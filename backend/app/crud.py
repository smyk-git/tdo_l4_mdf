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
