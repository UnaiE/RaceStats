from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models_sql.comparison import Comparison

def create_comparison_controller(db: Session, user_id: int, entity_type: str, entity_ids: str):
    new_comp = Comparison(user_id=user_id, entity_type=entity_type, entity_ids=entity_ids)
    db.add(new_comp)
    db.commit()
    db.refresh(new_comp)
    return new_comp

def delete_comparison_controller(db: Session, comparison_id: int):
    comp = db.query(Comparison).filter(Comparison.id == comparison_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Comparison not found")
    db.delete(comp)
    db.commit()
    return {"deleted": comparison_id}
