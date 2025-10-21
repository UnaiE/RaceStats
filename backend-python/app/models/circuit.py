from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.resources.database import Base

class Circuit(Base):
    __tablename__ = "circuits"

    id = Column(Integer, primary_key=True, index=True)
    circuit_id = Column(String, unique=True, nullable=False)  # ID de Ergast
    name = Column(String, nullable=False)
    location = Column(String)
    country = Column(String)
    length_km = Column(Float, nullable=True)
    turns = Column(Integer, nullable=True)
    first_gp_year = Column(Integer, nullable=True)
    lap_record = Column(String, nullable=True)  # "1:18.750 - Lewis Hamilton (2020)"
    image_url = Column(String, nullable=True)

    # Relación con Race
    races = relationship("Race", back_populates="circuit")

    def __repr__(self):
        return f"<Circuit(name='{self.name}', country='{self.country}')>"
