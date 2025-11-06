from sqlalchemy import Column, Integer, String
from app.resources.db_sql import Base
from app.models_sql.favorite import Favorite
from app.models_sql.comparison import Comparison
from sqlalchemy.orm import relationship
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    favorites = relationship("Favorite", back_populates="user", cascade="all, delete")
    comparisons = relationship("Comparison", back_populates="user", cascade="all, delete")
