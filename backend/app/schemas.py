from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "surveyor"

class User(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class SurveyImageResponse(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True

class SurveyBase(BaseModel):
    mandal: str
    panchayat: str
    village: str
    status: str
    borewell_type: str
    supply_nature: str
    borewell_depth: float
    motor_capacity: float
    motor_depth: float
    tds: float
    ph: float
    hardness: float
    drilled_year: int
    dried: bool
    dried_months: Optional[str] = None
    crop_type: str
    other: Optional[str] = None
    number_of_animals: int
    latitude: float
    longitude: float

class SurveyCreate(SurveyBase):
    pass

class Survey(SurveyBase):
    survey_id: int
    created_date: datetime
    created_by: int
    images: List[SurveyImageResponse] = []

    class Config:
        from_attributes = True
