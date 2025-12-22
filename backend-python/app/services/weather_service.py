"""
Servicio para obtener pronóstico del clima usando WeatherAPI.com
"""
import os
import random
import requests
from typing import Optional, List, Dict
from datetime import datetime, timedelta

class WeatherService:
    def __init__(self):
        # API Key desde variable de entorno
        self.api_key = os.getenv("WEATHER_API_KEY", "")
        self.base_url = "https://api.weatherapi.com/v1"
        self.cache = {}
        self.cache_duration = timedelta(hours=6)
    
    def get_forecast(self, location: str, race_date: str = None, days: int = 3) -> Optional[Dict]:
        """
        Obtiene pronóstico del clima para una ubicación en fechas específicas
        
        Args:
            location: Ciudad o coordenadas (ej: "Las Vegas" o "36.1147,-115.1728")
            race_date: Fecha de la carrera (formato YYYY-MM-DD) para buscar pronóstico específico
            days: Número de días (1-3 en free tier)
        
        Returns:
            Diccionario con forecast o None si hay error
        """
        # Si no hay API key válida, devolver datos mock
        if not self.api_key or self.api_key == "your_api_key_here" or len(self.api_key.strip()) == 0:
            print(f"⚠️ No hay API key configurada, usando datos mock para {location}")
            return self._get_mock_forecast(location, race_date, days)
        
        # Verificar cache
        cache_key = f"{location}_{race_date}_{days}"
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if datetime.now() - cached_time < self.cache_duration:
                print(f"✅ Usando cache para {location} ({race_date})")
                return cached_data
        
        # Llamar a API
        try:
            # Si hay fecha de carrera, usar endpoint de fecha específica
            if race_date:
                # Convertir fecha de carrera a datetime
                try:
                    race_dt = datetime.fromisoformat(race_date.replace('Z', '+00:00'))
                    
                    # Calcular días desde hoy hasta la carrera
                    days_until_race = (race_dt.date() - datetime.now().date()).days
                    
                    # Si la carrera es en más de 14 días, usar mock en su lugar
                    if days_until_race > 14:
                        print(f"⚠️ Carrera muy lejana ({days_until_race} días), usando datos mock")
                        return self._get_mock_forecast(location, race_date, days)
                    elif days_until_race < 0:
                        print(f"⚠️ Carrera ya pasó, usando datos históricos simulados")
                        # Para carreras pasadas, retornar None
                        return None
                    else:
                        # Carrera dentro de los próximos 14 días - usar forecast
                        url = f"{self.base_url}/forecast.json"
                        params = {
                            "key": self.api_key,
                            "q": location,
                            "days": min(days_until_race + 3, 14),  # Obtener hasta el día de la carrera + 2 días
                            "lang": "es",
                            "aqi": "no"
                        }
                except Exception as e:
                    print(f"⚠️ Error procesando fecha: {e}, usando forecast estándar")
                    url = f"{self.base_url}/forecast.json"
                    params = {
                        "key": self.api_key,
                        "q": location,
                        "days": days,
                        "lang": "es",
                        "aqi": "no"
                    }
            else:
                # Sin fecha específica, usar forecast normal
                url = f"{self.base_url}/forecast.json"
                params = {
                    "key": self.api_key,
                    "q": location,
                    "days": days,
                    "lang": "es",
                    "aqi": "no"
                }
            
            response = requests.get(url, params=params, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                
                # Procesar datos y filtrar por fecha de carrera si está especificada
                forecast_data = self._process_forecast(data, race_date)
                
                # Guardar en cache
                self.cache[cache_key] = (forecast_data, datetime.now())
                
                print(f"✅ Pronóstico obtenido para {location}" + (f" ({race_date})" if race_date else ""))
                return forecast_data
            else:
                print(f"⚠️ Error en API: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error obteniendo pronóstico: {e}")
            return None
    
    def _process_forecast(self, raw_data: Dict, target_date: str = None) -> Dict:
        """Procesa y simplifica los datos de la API, filtrando por fecha objetivo si se especifica"""
        location = raw_data.get("location", {})
        forecast_days = raw_data.get("forecast", {}).get("forecastday", [])
        
        processed = {
            "location": {
                "name": location.get("name"),
                "country": location.get("country"),
                "localtime": location.get("localtime")
            },
            "forecast": []
        }
        
        # Si hay fecha objetivo, calcular el rango del fin de semana (Viernes, Sábado, Domingo)
        target_days = []
        if target_date:
            try:
                race_dt = datetime.fromisoformat(target_date.replace('Z', '+00:00'))
                # Calcular Viernes, Sábado y Domingo del GP
                # Asumiendo que la carrera es el domingo
                friday = (race_dt - timedelta(days=2)).date()
                saturday = (race_dt - timedelta(days=1)).date()
                sunday = race_dt.date()
                
                target_days = [friday, saturday, sunday]
                print(f"🏁 Buscando pronóstico para fin de semana: {friday}, {saturday}, {sunday}")
            except Exception as e:
                print(f"⚠️ Error calculando fin de semana: {e}")
        
        # Filtrar días según target_date o tomar los primeros 3
        for day in forecast_days:
            date_obj = datetime.strptime(day["date"], "%Y-%m-%d")
            
            # Si hay target_days, solo incluir esos días
            if target_days and date_obj.date() not in target_days:
                continue
            
            day_data = day.get("day", {})
            
            processed["forecast"].append({
                "date": day["date"],
                "day_name": self._get_spanish_day(date_obj.weekday()),
                "day_number": date_obj.day,
                "max_temp": day_data.get("maxtemp_c"),
                "min_temp": day_data.get("mintemp_c"),
                "condition": day_data.get("condition", {}).get("text"),
                "icon": day_data.get("condition", {}).get("icon"),
                "rain_chance": day_data.get("daily_chance_of_rain"),
                "rain_mm": day_data.get("totalprecip_mm")
            })
            
            # Si ya tenemos 3 días, parar
            if len(processed["forecast"]) >= 3:
                break
        
        return processed
    
    def _get_spanish_day(self, weekday: int) -> str:
        """Convierte número de día a abreviatura en español"""
        days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        return days[weekday]
    
    def _get_mock_forecast(self, location: str, race_date: str = None, days: int = 3) -> Dict:
        """Genera datos de pronóstico mock para cuando no hay API key"""
        print(f"🎲 Generando pronóstico mock para {location}, fecha: {race_date}, días: {days}")
        
        # Si hay fecha de carrera, calcular el fin de semana
        if race_date:
            try:
                race_dt = datetime.fromisoformat(race_date.replace('Z', '+00:00'))
                friday = race_dt - timedelta(days=2)
                saturday = race_dt - timedelta(days=1)
                sunday = race_dt
                forecast_dates = [friday, saturday, sunday]
                print(f"📅 Fechas calculadas: {friday.date()}, {saturday.date()}, {sunday.date()}")
            except Exception as e:
                print(f"⚠️ Error calculando fechas: {e}")
                # Si falla, usar próximos 3 días
                base_date = datetime.now()
                forecast_dates = [base_date + timedelta(days=i) for i in range(days)]
        else:
            base_date = datetime.now()
            forecast_dates = [base_date + timedelta(days=i) for i in range(days)]
        
        # Condiciones realistas por ciudad
        conditions_by_city = {
            "melbourne": ["Parcialmente nublado", "Soleado", "Despejado"],
            "bahrain": ["Despejado", "Soleado", "Caluroso"],
            "jeddah": ["Despejado", "Soleado", "Muy caluroso"],
            "suzuka": ["Nublado", "Parcialmente nublado", "Lluvia ligera"],
            "shanghai": ["Nublado", "Parcialmente nublado", "Soleado"],
            "miami": ["Soleado", "Caluroso", "Tormentoso"],
            "monaco": ["Soleado", "Parcialmente nublado", "Despejado"],
            "barcelona": ["Soleado", "Despejado", "Caluroso"],
            "silverstone": ["Nublado", "Lluvia ligera", "Parcialmente nublado"],
            "spa": ["Lluvia", "Nublado", "Lluvia ligera"],
            "monza": ["Soleado", "Despejado", "Caluroso"],
            "singapore": ["Lluvia", "Tormentoso", "Nublado"],
            "suzuka": ["Nublado", "Lluvia ligera", "Parcialmente nublado"],
            "austin": ["Soleado", "Caluroso", "Despejado"],
            "mexico": ["Soleado", "Despejado", "Parcialmente nublado"],
            "interlagos": ["Lluvia", "Nublado", "Tormentoso"],
            "las vegas": ["Despejado", "Soleado", "Fresco"],
            "abu dhabi": ["Despejado", "Soleado", "Muy caluroso"],
        }
        
        # Buscar condiciones por ciudad
        location_lower = location.lower()
        conditions = ["Parcialmente nublado", "Soleado", "Despejado"]  # Default
        
        for city, city_conditions in conditions_by_city.items():
            if city in location_lower:
                conditions = city_conditions
                break
        
        mock_data = {
            "location": {
                "name": location,
                "country": "Australia" if "melbourne" in location.lower() else "Country",
                "localtime": datetime.now().isoformat()
            },
            "forecast": []
        }
        
        print(f"🔧 Generando {len(forecast_dates[:days])} días de pronóstico...")
        
        for i, date in enumerate(forecast_dates[:days]):
            condition = conditions[i % len(conditions)]
            
            # Temperaturas realistas según condición
            if "caluroso" in condition.lower() or "soleado" in condition.lower():
                max_temp = random.randint(28, 35)
                min_temp = max_temp - random.randint(8, 12)
                rain_mm = 0
                rain_chance = random.randint(0, 10)
            elif "lluv" in condition.lower():
                max_temp = random.randint(18, 24)
                min_temp = max_temp - random.randint(5, 8)
                rain_mm = random.uniform(2.0, 15.0)
                rain_chance = random.randint(60, 95)
            elif "nublado" in condition.lower():
                max_temp = random.randint(20, 26)
                min_temp = max_temp - random.randint(6, 10)
                rain_mm = random.uniform(0, 3.0) if random.random() > 0.5 else 0
                rain_chance = random.randint(20, 50)
            else:  # Despejado
                max_temp = random.randint(24, 30)
                min_temp = max_temp - random.randint(7, 11)
                rain_mm = 0
                rain_chance = random.randint(0, 15)
            
            print(f"  ✓ Día {i+1}: {date.strftime('%Y-%m-%d')} - {condition}, {max_temp}°C")
            
            mock_data["forecast"].append({
                "date": date.strftime("%Y-%m-%d"),
                "day_name": self._get_spanish_day(date.weekday()),
                "day_number": date.day,
                "max_temp": round(max_temp, 1),
                "min_temp": round(min_temp, 1),
                "condition": condition,
                "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                "rain_chance": rain_chance,
                "rain_mm": round(rain_mm, 1)
            })
        
        print(f"🌤️ Pronóstico mock generado: {len(mock_data['forecast'])} días")
        return mock_data

# Instancia global del servicio
weather_service = WeatherService()
