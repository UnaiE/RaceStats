from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.resources.database import Base

class Championship(Base):
    __tablename__ = "championships"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    governing_body = Column(String, default="FIA")
    description = Column(String, nullable=True)
    founded = Column(Integer, nullable=True)
    logo_url = Column(String, nullable=True)
    country = Column(String, nullable=True)

    # Relación: un campeonato tiene muchas temporadas
    seasons = relationship("Season", back_populates="championship")

    def __repr__(self):
        return f"<Championship(name='{self.name}', founded={self.founded})>"
