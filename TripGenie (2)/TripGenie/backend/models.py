"""
TripGenie - Data Models & Pydantic Schemas
Defines request, response, and database schemas with strong validation.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class TripGenerateRequest(BaseModel):
    destination: str = Field(..., min_length=2, description="Target travel destination (e.g. Goa, Paris, Tokyo)")
    budget: float = Field(..., gt=0, description="Total budget in user's selected currency")
    currency: str = Field(default="INR", description="Currency code (e.g. INR, USD, EUR, GBP)")
    days: int = Field(..., ge=1, le=30, description="Number of days for the itinerary")
    travelStyle: str = Field(..., description="Solo, Couple, Family, Friends, or Business")
    travelers: int = Field(default=1, ge=1, le=50, description="Total number of travelers")
    interests: List[str] = Field(..., min_items=1, description="List of chosen interest tags")
    startDate: Optional[str] = Field(default=None, description="Start date in YYYY-MM-DD format")


class BudgetBreakdown(BaseModel):
    accommodation: float = Field(..., description="Estimated cost for stay/hotels")
    food: float = Field(..., description="Estimated cost for meals & dining")
    activities: float = Field(..., description="Estimated cost for tickets, tours & sightseeing")
    transport: float = Field(..., description="Estimated cost for local transit & cab services")
    miscellaneous: float = Field(..., description="Estimated buffer & shopping budget")
    total: float = Field(..., description="Total aggregated estimate")
    currency: str = Field(default="INR")
    perPersonCost: Optional[float] = None
    savingsTip: Optional[str] = None


class DayActivity(BaseModel):
    timeSlot: str = Field(..., description="Morning, Afternoon, or Evening")
    activity: str = Field(..., description="Activity title")
    location: str = Field(..., description="Specific landmark or venue")
    description: str = Field(..., description="Detailed description of the experience")
    estimatedCost: Optional[float] = 0.0
    tips: Optional[str] = None


class DayPlan(BaseModel):
    day: int = Field(..., description="Day number (1, 2, ...)")
    title: str = Field(..., description="Daily theme / headline")
    morning: str = Field(..., description="Morning plan details")
    afternoon: str = Field(..., description="Afternoon plan details")
    evening: str = Field(..., description="Evening plan details")
    activities: Optional[List[DayActivity]] = Field(default_factory=list)


class MapPoint(BaseModel):
    id: str
    name: str
    category: str = Field(..., description="City, Beach, Historical, Nature, Hotel, Food, Adventure")
    lat: float
    lng: float
    description: str
    rating: Optional[float] = 4.8
    entryFee: Optional[float] = 0.0


class TripResponse(BaseModel):
    id: Optional[str] = None
    destination: str
    budget: float
    currency: str = "INR"
    days: int
    travelStyle: str
    travelers: int
    interests: List[str]
    startDate: Optional[str] = None
    summary: str
    dayPlans: List[DayPlan]
    budgetBreakdown: BudgetBreakdown
    mapPoints: List[MapPoint]
    travelTips: List[str]
    packingSuggestions: List[str]
    emergencyContacts: List[str]
    bestLocalFoods: List[str]
    generatedItineraryMarkdown: str
    source: str = "OpenAI GPT-4o-mini (Few-Shot)"
    createdAt: Optional[str] = None


class SaveTripRequest(BaseModel):
    destination: str
    budget: float
    currency: str = "INR"
    days: int
    travelStyle: str
    travelers: int
    interests: List[str]
    startDate: Optional[str] = None
    summary: str
    dayPlans: List[DayPlan]
    budgetBreakdown: BudgetBreakdown
    mapPoints: List[MapPoint]
    travelTips: List[str]
    packingSuggestions: List[str]
    emergencyContacts: List[str]
    bestLocalFoods: List[str]
    generatedItineraryMarkdown: Optional[str] = ""
    estimatedCost: Optional[float] = None
    source: Optional[str] = "TripGenie AI"


class SavedTripInDB(BaseModel):
    id: str = Field(alias="_id")
    destination: str
    budget: float
    currency: str = "INR"
    days: int
    travelStyle: str
    travelers: int
    interests: List[str]
    startDate: Optional[str] = None
    summary: str
    dayPlans: List[DayPlan]
    budgetBreakdown: BudgetBreakdown
    mapPoints: List[MapPoint]
    travelTips: List[str]
    packingSuggestions: List[str]
    emergencyContacts: List[str]
    bestLocalFoods: List[str]
    generatedItineraryMarkdown: Optional[str] = ""
    estimatedCost: Optional[float] = None
    source: Optional[str] = "TripGenie AI"
    createdAt: str

    class Config:
        populate_by_name = True


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    database: str
    aiEngine: str
    datasetStatus: str
