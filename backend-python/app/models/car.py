from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)                # Ejemplo: "W15", "RB20"
    model_year = Column(Integer, nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"))
    engine = Column(String, nullable=True)
    weight_kg = Column(Float, nullable=True)
    top_speed_kmh = Column(Float, nullable=True)
    acceleration_0_100 = Column(Float, nullable=True)
    power_hp = Column(Integer, nullable=True)
    image_url = Column(String, nullable=True)

    # Relación con Team
    team = relationship("Team", back_populates="cars")

    def __repr__(self):
        return f"<Car(name='{self.name}', team='{self.team_id}', year={self.model_year})>"
