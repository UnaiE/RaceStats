from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models_sql.comparison import Comparison
from app.schemas.sql.comparison_schemas import ComparisonCreate, ComparisonResponse
from app.resources.db_sql import get_db

router = APIRouter()

@router.post("/", response_model=ComparisonResponse)
def create_comparison(comp: ComparisonCreate, db: Session = Depends(get_db)):
    new_comp = Comparison(**comp.dict())
    db.add(new_comp)
    db.commit()
    db.refresh(new_comp)
    return new_comp

@router.get("/user/{user_id}", response_model=List[ComparisonResponse])
def get_user_comparisons(user_id: int, db: Session = Depends(get_db)):
    return db.query(Comparison).filter(Comparison.user_id == user_id).all()

@router.delete("/{comparison_id}")
def delete_comparison(comparison_id: int, db: Session = Depends(get_db)):
    comp = db.query(Comparison).filter(Comparison.id == comparison_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Comparison not found")
    db.delete(comp)
    db.commit()
    return {"deleted": comparison_id}
