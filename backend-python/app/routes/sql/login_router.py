from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.resources.db_sql import get_db
from app.services.sql_services import get_user_by_email
from app.controllers.sql.user_controller import verify_password  # función que compares hash

router = APIRouter(prefix="/login", tags=["Login"])


@router.post("/login")
def login_user(email: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": {"id": user.id, "email": user.email}}
