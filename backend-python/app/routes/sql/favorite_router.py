from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models_sql.favorite import Favorite
from app.schemas.sql.favorite_schemas import FavoriteCreate, FavoriteResponse
from app.resources.db_sql import get_db
from app.services import sql_services

router = APIRouter()

@router.post("/", response_model=FavoriteResponse)
def create_favorite_endpoint(favorite: FavoriteCreate, db: Session = Depends(get_db)):
    return sql_services.create_favorite(db, favorite.user_id, favorite.entity_type, favorite.entity_id)

@router.get("/user/{user_id}", response_model=List[FavoriteResponse])
def get_user_favorites_endpoint(user_id: int, db: Session = Depends(get_db)):
    return sql_services.get_user_favorites(db, user_id)

@router.delete("/{favorite_id}")
def delete_favorite_endpoint(favorite_id: int, db: Session = Depends(get_db)):
    return sql_services.delete_favorite(db, favorite_id)

   
