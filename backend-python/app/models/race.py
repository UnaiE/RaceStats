from sqlalchemy import Column, Integer, String, ForeignKey
from app.resources.database import Base
from sqlalchemy.orm import relationship

class Race(Base):
    __tablename__ = "races"

    id = Column(Integer, primary_key=True, index=True)
    season = Column(String)
    round = Column(Integer)
    race_name = Column(String)
    circuit_name = Column(String)
    date = Column(String)
    location = Column(String)
    country = Column(String)
    winner_id = Column(String, ForeignKey("drivers.driver_id"), nullable=True)
    
  # Relaciones
    season_id = Column(Integer, ForeignKey("seasons.id"), nullable=True)
    circuit_id = Column(Integer, ForeignKey("circuits.id"), nullable=True)

    season_rel = relationship("Season", back_populates="races")
    winner = relationship("Driver", lazy="joined")
    circuit = relationship("Circuit", back_populates="races")
