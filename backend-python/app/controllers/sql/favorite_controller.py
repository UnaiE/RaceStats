from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.sql_services import create_favorite, get_user_favorites, delete_favorite

def create_favorite_controller(db: Session, user_id: int, entity_type: str, entity_id: str):
    return create_favorite(db, user_id, entity_type, entity_id)

def get_user_favorites_controller(db: Session, user_id: int):
    return get_user_favorites(db, user_id)

def delete_favorite_controller(db: Session, favorite_id: int):
    deleted = delete_favorite(db, favorite_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"deleted": favorite_id}
