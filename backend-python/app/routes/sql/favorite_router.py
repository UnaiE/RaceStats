from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models_sql.favorite import Favorite
from app.schemas.sql.favorite_schemas import FavoriteCreate, FavoriteResponse
from app.resources.db_sql import get_db
from app.services.sql_services import get_user_favorites, create_favorite, delete_favorite

router = APIRouter()

@router.post("/", response_model=FavoriteResponse)
def create_favorite(favorite: FavoriteCreate, db: Session = Depends(get_db)):
    return create_favorite(db, favorite.user_id, favorite.entity_type, favorite.entity_id)

@router.get("/user/{user_id}", response_model=List[FavoriteResponse])
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
    return get_user_favorites(db, user_id)

@router.delete("/{favorite_id}")
def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    return delete_favorite(db, favorite_id)

   
