from sqlalchemy import Column, Integer, String, ForeignKey
from app.resources.database import Base
from sqlalchemy.orm import relationship

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(String, unique=True, index=True)  # código de Ergast
    given_name = Column(String)
    family_name = Column(String)
    nationality = Column(String)
    date_of_birth = Column(String)
    permanent_number = Column(String, nullable=True)
    championships = Column(Integer, default=0)
    podiums = Column(Integer, default=0)
    points = Column(Integer, default=0)
    wins = Column(Integer, default=0)
    # Relación con Team
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team = relationship("Team", back_populates="drivers")

    # Relación: un piloto tiene muchas temporadas
    championships = relationship("Championship", back_populates="drivers")
