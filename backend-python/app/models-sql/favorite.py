from sqlalchemy import Column, Integer, ForeignKey, String
from app.resources.db_sql import Base

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    entity_type = Column(String, nullable=False)  # driver, team, race, car
    entity_id = Column(String, nullable=False)    # id de MongoDB
