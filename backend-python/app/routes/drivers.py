from fastapi import APIRouter
from services.eargast-service import get_all_drivers

router = APIRouter(prefix="/drivers", tags=["drivers"])

@router.get("/")
def list_drivers():
    return get_all_drivers()
