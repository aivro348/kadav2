from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="surveyor") # 'admin' or 'surveyor'

class Survey(Base):
    __tablename__ = "surveys"

    survey_id = Column(Integer, primary_key=True, index=True)
    
    # Location
    mandal = Column(String)
    panchayat = Column(String)
    village = Column(String)
    
    # Status & Type
    status = Column(String) # Successful, Seasonal / Summer Dry, Dried
    borewell_type = Column(String) # Agriculture / Horticulture, Livestock / Animals
    supply_nature = Column(String)
    
    # Details
    borewell_depth = Column(Float)
    motor_capacity = Column(Float)
    motor_depth = Column(Float)
    
    # Quality
    tds = Column(Float)
    ph = Column(Float)
    hardness = Column(Float)
    
    # History
    drilled_year = Column(Integer)
    dried = Column(Boolean)
    dried_months = Column(String)
    
    # Utilization
    crop_type = Column(String)
    other = Column(String)
    number_of_animals = Column(Integer)
    
    # GPS
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Meta
    created_date = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    images = relationship("SurveyImage", back_populates="survey")

class SurveyImage(Base):
    __tablename__ = "survey_images"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.survey_id"))
    file_path = Column(String)
    
    survey = relationship("Survey", back_populates="images")
