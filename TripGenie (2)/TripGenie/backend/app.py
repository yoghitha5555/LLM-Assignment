"""
TripGenie - AI-Powered Travel Itinerary Generator
Main FastAPI Application Entrypoint
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

import database
from routes import router

load_dotenv()

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("tripgenie.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown routines."""
    logger.info("Initializing TripGenie Backend...")
    await database.init_db()
    logger.info("TripGenie Backend is ready to serve requests.")
    yield
    logger.info("Shutting down TripGenie Backend...")


app = FastAPI(
    title="TripGenie – AI-Powered Travel Itinerary Generator",
    description="Transformer-based Few-Shot LLM Travel Planner REST API with MongoDB & ReportLab PDF Export",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware Configuration
cors_origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
if not origins or "*" in origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "path": str(request.url.path)
        }
    )


# Mount routes under both /api and root level for maximum frontend compatibility
app.include_router(router, prefix="/api")
app.include_router(router)  # Also mounts /generate, /save, /trips directly


@app.get("/", tags=["Root"])
async def root():
    return {
        "app": "TripGenie – AI-Powered Travel Itinerary Generator",
        "status": "Online",
        "documentation": "/docs",
        "endpoints": {
            "generate": "POST /generate or POST /api/generate",
            "save": "POST /save or POST /api/save",
            "trips": "GET /trips or GET /api/trips",
            "exportPdf": "POST /export-pdf or POST /api/export-pdf",
            "health": "GET /health or GET /api/health"
        }
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting TripGenie server on {host}:{port}")
    uvicorn.run("app:app", host=host, port=port, reload=True)
