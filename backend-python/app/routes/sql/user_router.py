from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.sql.user_schemas import UserCreate, UserResponse
from app.resources.db_sql import get_db
from app.controllers.sql.user_controller import (
    create_user_controller, get_all_users_controller, get_user_by_id_controller
)

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_controller(db, user.username, user.email, user.password)

@router.get("/", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db)):
    return get_all_users_controller(db)

@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_by_id_controller(db, user_id)
