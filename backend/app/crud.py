from sqlalchemy.orm import Session
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
