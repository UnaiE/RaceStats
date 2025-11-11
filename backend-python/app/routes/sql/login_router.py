from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.resources.db_sql import get_db
from app.schemas.sql.user_schemas import UserLogin, UserLoginResponse
from app.controllers.sql.user_controller import login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=UserLoginResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Iniciar sesión con email y contraseña.
    
    - **email**: Email del usuario
    - **password**: Contraseña del usuario
    """
    return login_user(db, credentials.email, credentials.password)
