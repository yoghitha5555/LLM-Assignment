"""
TripGenie - MongoDB & Fallback Data Layer
Provides resilient asynchronous storage with Motor MongoDB client
and transparent local file fallback if MongoDB is not locally running.
"""

import os
import json
import uuid
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("tripgenie.database")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "tripgenie_db")
FALLBACK_FILE = os.path.join(os.path.dirname(__file__), "data", "saved_trips.json")

# In-memory and fallback cache
_fallback_trips: Dict[str, Dict[str, Any]] = {}
_use_mongodb = False
_mongo_client = None
_db = None


def _ensure_data_dir():
    os.makedirs(os.path.dirname(FALLBACK_FILE), exist_ok=True)
    if os.path.exists(FALLBACK_FILE):
        try:
            with open(FALLBACK_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    _fallback_trips.update(data)
                elif isinstance(data, list):
                    for item in data:
                        tid = str(item.get("_id") or item.get("id") or uuid.uuid4())
                        item["_id"] = tid
                        _fallback_trips[tid] = item
        except Exception as e:
            logger.warning(f"Could not load fallback file: {e}")


def _save_to_fallback_file():
    try:
        os.makedirs(os.path.dirname(FALLBACK_FILE), exist_ok=True)
        with open(FALLBACK_FILE, "w", encoding="utf-8") as f:
            json.dump(_fallback_trips, f, indent=2, default=str)
    except Exception as e:
        logger.error(f"Error saving to fallback file: {e}")


async def init_db():
    """Initializes MongoDB connection or falls back to local storage."""
    global _use_mongodb, _mongo_client, _db
    _ensure_data_dir()

    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
        # Verify connection
        await client.server_info()
        _mongo_client = client
        _db = client[DATABASE_NAME]
        _use_mongodb = True
        logger.info(f"Connected successfully to MongoDB at {MONGODB_URL}/{DATABASE_NAME}")
    except Exception as e:
        _use_mongodb = False
        logger.warning(
            f"MongoDB connection to {MONGODB_URL} not active ({e}). "
            f"Activating seamless local JSON/Memory storage fallback."
        )


def get_db_status() -> Dict[str, Any]:
    return {
        "connected": _use_mongodb,
        "engine": "MongoDB (Motor Async)" if _use_mongodb else "Local JSON Storage (Fallback)",
        "url": MONGODB_URL if _use_mongodb else FALLBACK_FILE
    }


async def save_trip(trip_data: Dict[str, Any]) -> Dict[str, Any]:
    """Persist a trip record to MongoDB or Fallback store."""
    trip_id = trip_data.get("_id") or trip_data.get("id") or str(uuid.uuid4())
    trip_data["_id"] = trip_id
    trip_data["id"] = trip_id
    if "createdAt" not in trip_data or not trip_data["createdAt"]:
        trip_data["createdAt"] = datetime.utcnow().isoformat()

    if _use_mongodb and _db is not None:
        try:
            await _db.trips.update_one({"_id": trip_id}, {"$set": trip_data}, upsert=True)
            return trip_data
        except Exception as e:
            logger.error(f"MongoDB save failed: {e}. Writing to fallback cache.")

    _fallback_trips[trip_id] = trip_data
    _save_to_fallback_file()
    return trip_data


async def get_all_trips() -> List[Dict[str, Any]]:
    """Fetch all saved trips sorted by creation date."""
    if _use_mongodb and _db is not None:
        try:
            cursor = _db.trips.find().sort("createdAt", -1)
            trips = []
            async for doc in cursor:
                doc["id"] = str(doc.get("_id"))
                trips.append(doc)
            return trips
        except Exception as e:
            logger.error(f"MongoDB fetch failed: {e}. Falling back to local cache.")

    _ensure_data_dir()
    trips = list(_fallback_trips.values())
    trips.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return trips


async def get_trip_by_id(trip_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single trip by ID."""
    if _use_mongodb and _db is not None:
        try:
            doc = await _db.trips.find_one({"_id": trip_id})
            if doc:
                doc["id"] = str(doc.get("_id"))
                return doc
        except Exception as e:
            logger.error(f"MongoDB fetch one failed: {e}")

    _ensure_data_dir()
    return _fallback_trips.get(trip_id)


async def delete_trip(trip_id: str) -> bool:
    """Delete a trip by ID."""
    deleted = False
    if _use_mongodb and _db is not None:
        try:
            res = await _db.trips.delete_one({"_id": trip_id})
            if res.deleted_count > 0:
                deleted = True
        except Exception as e:
            logger.error(f"MongoDB delete failed: {e}")

    if trip_id in _fallback_trips:
        del _fallback_trips[trip_id]
        _save_to_fallback_file()
        deleted = True

    return deleted
