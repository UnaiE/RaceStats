"""
Router para endpoints de clima
"""
from fastapi import APIRouter, HTTPException
from app.services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/{location}")
def get_weather_forecast(location: str, race_date: str = None, days: int = 3):
    """
    Obtiene pronóstico del clima para una ubicación en el fin de semana del GP
    
    Args:
        location: Ciudad o circuito (ej: "Las Vegas", "Monaco")
        race_date: Fecha de la carrera (formato ISO) para buscar fin de semana específico
        days: Número de días de pronóstico (1-3)
    
    Returns:
        JSON con forecast del fin de semana del GP (Viernes, Sábado, Domingo)
    """
    if days < 1 or days > 3:
        raise HTTPException(
            status_code=400,
            detail="Days must be between 1 and 3"
        )
    
    forecast = weather_service.get_forecast(location, race_date, days)
    
    if not forecast:
        raise HTTPException(
            status_code=404,
            detail=f"No se pudo obtener pronóstico para {location}"
        )
    
    return forecast
