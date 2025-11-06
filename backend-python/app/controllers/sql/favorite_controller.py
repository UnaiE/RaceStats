from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models_sql.favorite import Favorite

def create_favorite_controller(db: Session, user_id: int, entity_type: str, entity_id: str):
    new_fav = Favorite(user_id=user_id, entity_type=entity_type, entity_id=entity_id)
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav

def delete_favorite_controller(db: Session, favorite_id: int):
    fav = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"deleted": favorite_id}
