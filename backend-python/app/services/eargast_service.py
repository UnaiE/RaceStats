# services/ergast_service.py
import requests

def get_all_drivers():
    url = "https://ergast.com/api/f1/drivers.json?limit=30"
    return requests.get(url).json()
