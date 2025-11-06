from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.resources.db_sql import Base

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)  # ID de MongoDB u otra entidad

    user = relationship("User", back_populates="favorites")
