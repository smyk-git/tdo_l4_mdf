from sqlalchemy.orm import Session
from . import models, schemas

def get_items(db: Session):
    return sorted(db.query(models.Item).all(), key=lambda item: item.id)

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
    update_data = item_in.dict(exclude_unset=True)
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