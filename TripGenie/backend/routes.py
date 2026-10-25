"""
TripGenie - REST API Routes
Implements all generation, persistence, PDF streaming, and recommendation endpoints.
"""

import os
import io
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, HTTPException, Response, status, Query, Body
from fastapi.responses import StreamingResponse

import database
from models import (
    TripGenerateRequest,
    TripResponse,
    SaveTripRequest,
    HealthResponse
)
from llm import generate_itinerary_with_llm, OPENAI_API_KEY, OPENAI_MODEL
from utils import build_pdf_itinerary, dataset_manager, DESTINATION_COORDINATES

logger = logging.getLogger("tripgenie.routes")

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Returns server and subsystem health status."""
    db_info = database.get_db_status()
    has_openai = bool(OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_openai"))
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        database=db_info["engine"],
        aiEngine=f"OpenAI {OPENAI_MODEL}" if has_openai else "Intelligent Heuristic Fallback Engine",
        datasetStatus=f"Loaded ({len(dataset_manager.traveler_df) if dataset_manager.traveler_df is not None else 0} historical trips)"
    )


@router.post("/generate", response_model=TripResponse, tags=["Trip Planning"])
async def generate_trip(req: TripGenerateRequest):
    """
    Generates a personalized day-wise travel itinerary using Few-Shot Transformer Prompting
    and contextual dataset enrichment.
    """
    try:
        logger.info(f"Generating itinerary for '{req.destination}', {req.days} days, budget {req.budget} {req.currency}")
        response = await generate_itinerary_with_llm(req)
        return response
    except Exception as e:
        logger.error(f"Error during trip generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate travel itinerary: {str(e)}"
        )


@router.post("/save", tags=["Trip Management"])
async def save_trip_endpoint(trip_req: SaveTripRequest):
    """
    Saves a generated itinerary to MongoDB or local storage.
    """
    try:
        trip_dict = trip_req.model_dump()
        saved = await database.save_trip(trip_dict)
        return {
            "success": True,
            "message": "Trip itinerary saved successfully!",
            "tripId": saved.get("_id") or saved.get("id"),
            "trip": saved
        }
    except Exception as e:
        logger.error(f"Error saving trip: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save trip itinerary: {str(e)}"
        )


@router.get("/trips", tags=["Trip Management"])
async def get_all_trips_endpoint(
    search: Optional[str] = Query(None, description="Search by destination or style"),
    travelStyle: Optional[str] = Query(None, description="Filter by travel style")
):
    """
    Retrieves all saved trips with optional search and style filtering.
    """
    try:
        trips = await database.get_all_trips()
        if search:
            q = search.lower().strip()
            trips = [
                t for t in trips
                if q in str(t.get("destination", "")).lower()
                or q in str(t.get("summary", "")).lower()
                or any(q in str(i).lower() for i in t.get("interests", []))
            ]
        if travelStyle:
            s = travelStyle.lower().strip()
            trips = [t for t in trips if str(t.get("travelStyle", "")).lower() == s]

        return {
            "count": len(trips),
            "trips": trips
        }
    except Exception as e:
        logger.error(f"Error retrieving saved trips: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trips"
        )


@router.get("/trips/{trip_id}", tags=["Trip Management"])
async def get_single_trip_endpoint(trip_id: str):
    """
    Retrieves a single trip by ID.
    """
    trip = await database.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found."
        )
    return trip


@router.delete("/trips/{trip_id}", tags=["Trip Management"])
async def delete_trip_endpoint(trip_id: str):
    """
    Deletes a saved trip by ID.
    """
    deleted = await database.delete_trip(trip_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found or already removed."
        )
    return {
        "success": True,
        "message": "Trip successfully deleted",
        "tripId": trip_id
    }


@router.post("/export-pdf", tags=["Export"])
async def export_itinerary_pdf_direct(trip_data: Dict[str, Any] = Body(...)):
    """
    Generates and streams a downloadable PDF itinerary from provided trip data.
    """
    try:
        pdf_bytes = build_pdf_itinerary(trip_data)
        dest_clean = trip_data.get("destination", "Travel").replace(" ", "_")
        filename = f"TripGenie_{dest_clean}_Itinerary.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf"
            }
        )
    except Exception as e:
        logger.error(f"PDF export error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF document: {str(e)}"
        )


@router.get("/trips/{trip_id}/pdf", tags=["Export"])
async def export_saved_trip_pdf(trip_id: str):
    """
    Fetches a saved trip from DB and exports it directly as a PDF.
    """
    trip = await database.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found for PDF export"
        )
    try:
        pdf_bytes = build_pdf_itinerary(trip)
        dest_clean = str(trip.get("destination", "Travel")).replace(" ", "_")
        filename = f"TripGenie_{dest_clean}_Itinerary.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf"
            }
        )
    except Exception as e:
        logger.error(f"PDF export error for trip {trip_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to compile trip PDF"
        )


@router.get("/destinations/popular", tags=["Recommendations"])
async def get_popular_destinations():
    """
    Returns curated list of popular travel destinations with sample coordinates.
    """
    destinations = [
        {"name": "Goa", "country": "India", "tag": "Beach & Nightlife", "avgBudget": 30000, "currency": "INR", "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600"},
        {"name": "Paris", "country": "France", "tag": "Art & Romance", "avgBudget": 220000, "currency": "INR", "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"},
        {"name": "Tokyo", "country": "Japan", "tag": "Culture & Tech", "avgBudget": 200000, "currency": "INR", "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600"},
        {"name": "Ooty", "country": "India", "tag": "Hill Station & Tea", "avgBudget": 18000, "currency": "INR", "image": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600"},
        {"name": "Bali", "country": "Indonesia", "tag": "Tropical & Adventure", "avgBudget": 80000, "currency": "INR", "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600"},
        {"name": "Manali", "country": "India", "tag": "Himalayan Snow", "avgBudget": 35000, "currency": "INR", "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600"},
        {"name": "Dubai", "country": "UAE", "tag": "Luxury & Desert", "avgBudget": 150000, "currency": "INR", "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600"},
        {"name": "Jaipur", "country": "India", "tag": "Royal Palaces", "avgBudget": 25000, "currency": "INR", "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600"},
    ]
    return {"destinations": destinations}
