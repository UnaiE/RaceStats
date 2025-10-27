from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models_sql.comparison import Comparison
from app.schemas.sql.comparison_schemas import ComparisonCreate, ComparisonResponse
from app.resources.db_sql import get_db
from app.services.sql_services import get_user_comparisons, create_comparison, delete_comparison

router = APIRouter()

@router.post("/", response_model=ComparisonResponse)
def create_comparison(comp: ComparisonCreate, db: Session = Depends(get_db)):
    return create_comparison(db, comp.user_id, comp.entity_type, comp.entity_ids)

@router.get("/user/{user_id}", response_model=List[ComparisonResponse])
def get_user_comparisons(user_id: int, db: Session = Depends(get_db)):
    return get_user_comparisons(db, user_id)

@router.delete("/{comparison_id}")
def delete_comparison(comparison_id: int, db: Session = Depends(get_db)):
    return delete_comparison(db, comparison_id)
    
