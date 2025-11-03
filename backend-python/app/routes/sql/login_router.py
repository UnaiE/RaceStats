from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.resources.db_sql import get_db
from app.services.sql_services import get_user_by_email
from app.controllers.sql.user_controller import verify_password  # función que compares hash
from app.controllers.sql.user_controller import login_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    return login_user(db, user["email"], user["password"])
