from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models_sql.favorite import Favorite
from app.schemas.sql.favorite_schemas import FavoriteCreate, FavoriteResponse
from app.resources.db_sql import get_db

router = APIRouter()

@router.post("/", response_model=FavoriteResponse)
def create_favorite(favorite: FavoriteCreate, db: Session = Depends(get_db)):
    new_fav = Favorite(**favorite.dict())
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav

@router.get("/user/{user_id}", response_model=List[FavoriteResponse])
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
    return db.query(Favorite).filter(Favorite.user_id == user_id).all()

@router.delete("/{favorite_id}")
def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"deleted": favorite_id}
