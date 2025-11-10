# backend-python/app/scripts/import_openf1.py
import asyncio
from app.resources.db_mongo import init_mongo
from app.services.openf1_import_service import import_all_openf1_data

async def main():
    await init_mongo()
    await import_all_openf1_data()

if __name__ == "__main__":
    asyncio.run(main())
