from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.sql_services import get_user_by_id, get_user_by_email, create_user, get_all_users
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    # truncamos manualmente por si el input es demasiado largo
    if len(password) > 72:
        password = password[:72]
    return pwd_context.hash(password)
# nueva función para login
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_user_controller(db: Session, username: str, email: str, password: str):
    existing = get_user_by_email(db, email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = get_password_hash(password)
    return create_user(db, username, email, hashed_pw)

def get_all_users_controller(db: Session):
    return get_all_users(db)

def get_user_by_id_controller(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    return {
        "user_id": user.id,
        "username": user.username, 
        "email": user.email,
        "message": f"Bienvenido/a, {user.username}"
    }
