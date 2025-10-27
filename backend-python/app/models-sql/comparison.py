from sqlalchemy import Column, Integer, ForeignKey, String
from app.resources.db_sql import Base

class Comparison(Base):
    __tablename__ = "comparisons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    entity_type = Column(String, nullable=False)
    entity_ids = Column(String, nullable=False)  # JSON string con IDs de MongoDB
