"""
Ergast API service for driver statistics
https://ergast.com/mrd/
"""
import requests
from typing import Optional, Dict
from datetime import datetime


class ErgastDriverService:
    BASE_URL = "https://ergast.com/api/f1"
    
    @staticmethod
    def get_driver_career_stats(driver_id: str) -> Optional[Dict]:
        """
        Get complete career statistics for a driver from Ergast API
        Returns: Dict with wins, poles, podiums, championships, races, etc.
        """
        try:
            # Get driver info and career summary
            url = f"{ErgastDriverService.BASE_URL}/drivers/{driver_id}.json"
            response = requests.get(url, timeout=10)
            
            if response.status_code != 200:
                return None
            
            data = response.json()
            driver_table = data.get("MRData", {}).get("DriverTable", {})
            drivers = driver_table.get("Drivers", [])
            
            if not drivers:
                return None
            
            driver_info = drivers[0]
            
            # Get wins
            wins_url = f"{ErgastDriverService.BASE_URL}/drivers/{driver_id}/results/1.json?limit=1000"
            wins_response = requests.get(wins_url, timeout=10)
            wins = 0
            if wins_response.status_code == 200:
                wins_data = wins_response.json()
                wins = int(wins_data.get("MRData", {}).get("total", 0))
            
            # Get poles (qualifying position 1)
            poles_url = f"{ErgastDriverService.BASE_URL}/drivers/{driver_id}/qualifying/1.json?limit=1000"
            poles_response = requests.get(poles_url, timeout=10)
            poles = 0
            if poles_response.status_code == 200:
                poles_data = poles_response.json()
                poles = int(poles_data.get("MRData", {}).get("total", 0))
            
            # Get podiums (positions 1, 2, 3)
            podiums = 0
            for position in [1, 2, 3]:
                podium_url = f"{ErgastDriverService.BASE_URL}/drivers/{driver_id}/results/{position}.json?limit=1000"
                podium_response = requests.get(podium_url, timeout=10)
                if podium_response.status_code == 200:
                    podium_data = podium_response.json()
                    podiums += int(podium_data.get("MRData", {}).get("total", 0))
            
            # Get championships
            championships_url = f"{ErgastDriverService.BASE_URL}/drivers/{driver_id}/driverStandings/1.json?limit=100"
            championships_response = requests.get(championships_url, timeout=10)
            championships = 0
            if championships_response.status_code == 200:
                champ_data = championships_response.json()
                championships = int(champ_data.get("MRData", {}).get("total", 0))
            
            # Get total races
            races_url = f"{ErgastDriverService.BASE_URL}/drivers/{driver_id}/results.json?limit=1"
            races_response = requests.get(races_url, timeout=10)
            total_races = 0
            if races_response.status_code == 200:
                races_data = races_response.json()
                total_races = int(races_data.get("MRData", {}).get("total", 0))
            
            # Get fastest laps
            fastest_laps_url = f"{ErgastDriverService.BASE_URL}/drivers/{driver_id}/fastest/1/results.json?limit=1"
            fastest_laps_response = requests.get(fastest_laps_url, timeout=10)
            fastest_laps = 0
            if fastest_laps_response.status_code == 200:
                fl_data = fastest_laps_response.json()
                fastest_laps = int(fl_data.get("MRData", {}).get("total", 0))
            
            return {
                "driver_id": driver_id,
                "given_name": driver_info.get("givenName"),
                "family_name": driver_info.get("familyName"),
                "date_of_birth": driver_info.get("dateOfBirth"),
                "nationality": driver_info.get("nationality"),
                "permanent_number": driver_info.get("permanentNumber"),
                "wins": wins,
                "poles": poles,
                "podiums": podiums,
                "championships": championships,
                "career_races": total_races,
                "career_fastest_laps": fastest_laps,
            }
            
        except Exception as e:
            print(f"Error fetching driver stats from Ergast: {e}")
            return None
    
    @staticmethod
    def calculate_age(birth_date: str) -> Optional[int]:
        """
        Calculate age from birth date string (YYYY-MM-DD format)
        """
        try:
            birth = datetime.strptime(birth_date, "%Y-%m-%d")
            today = datetime.now()
            age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
            return age
        except:
            return None
