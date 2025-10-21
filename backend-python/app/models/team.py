from sqlalchemy import Column, Integer, String
from app.resources.database import Base
from sqlalchemy.orm import relationship

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    nationality = Column(String)
    championships = Column(Integer)
    founded = Column(Integer, nullable=True)
    team_principal = Column(String, nullable=True)
    engine = Column(String, nullable=True)

    # Relación: un equipo tiene varios pilotos
    drivers = relationship("Driver", back_populates="team")

    # Relación: un piloto tiene muchas temporadas
    championships = relationship("Championship", back_populates="team")
    cars = relationship("Car", back_populates="team")
