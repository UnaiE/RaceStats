from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.resources.database import Base

class Season(Base):
    __tablename__ = "seasons"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, unique=True, nullable=False)
    champion_driver = Column(String, ForeignKey("drivers.driver_id"), nullable=True)
    champion_team = Column(String, ForeignKey("teams.name"), nullable=True)
    races_count = Column(Integer, default=0)
    fastest_lap_driver = Column(String, nullable=True)
    pole_position_driver = Column(String, nullable=True)
    status = Column(String, default="finished")  # Ej: "ongoing", "finished", "planned"

    # Relación con Championship
    championship_id = Column(Integer, ForeignKey("championships.id"))
    championship = relationship("Championship", back_populates="seasons")

    # Relación con Race
    races = relationship("Race", back_populates="season_rel")

    def __repr__(self):
        return f"<Season(year={self.year}, status={self.status})>"
