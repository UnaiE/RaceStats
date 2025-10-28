from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.sql_services import create_comparison, get_user_comparisons, delete_comparison

def create_comparison_controller(db: Session, user_id: int, entity_type: str, entity_ids: str):
    return create_comparison(db, user_id, entity_type, entity_ids)

def get_user_comparisons_controller(db: Session, user_id: int):
    return get_user_comparisons(db, user_id)

def delete_comparison_controller(db: Session, comparison_id: int):
    deleted = delete_comparison(db, comparison_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Comparison not found")
    return {"deleted": comparison_id}
