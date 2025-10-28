from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.sql_services import get_user_by_id, get_user_by_email, create_user, get_all_users

def create_user_controller(db: Session, username: str, email: str, password: str):
    existing = get_user_by_email(db, email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, username, email, password)

def get_all_users_controller(db: Session):
    return get_all_users(db)

def get_user_by_id_controller(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
