"""
TripGenie - Recommendation Engine & ReportLab PDF Generator
Leverages Pandas for dataset analytics and ReportLab for automated PDF export.
"""

import os
import io
import re
import math
import logging
from typing import Dict, List, Any, Optional, Tuple

try:
    import pandas as pd
except ImportError:
    pd = None

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib import colors
    from reportlab.lib.units import inch, cm
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
    )
    from reportlab.pdfgen import canvas
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False


logger = logging.getLogger("tripgenie.utils")

BASE_DIR = os.path.dirname(__file__)
TRAVELER_TRIP_CSV = os.path.join(BASE_DIR, "datasets", "traveler_trip.csv")
TRAVEL_REC_CSV = os.path.join(BASE_DIR, "datasets", "travel_recommendation.csv")

# Global coordinate registry for fast fallback lookup
DESTINATION_COORDINATES: Dict[str, Tuple[float, float]] = {
    "goa": (15.2993, 74.1240),
    "ooty": (11.4102, 76.6950),
    "manali": (32.2432, 77.1892),
    "jaipur": (26.9124, 75.7873),
    "kerala": (10.8505, 76.2711),
    "munnar": (10.0889, 77.0595),
    "alleppey": (9.4981, 76.3388),
    "varanasi": (25.3176, 82.9739),
    "ladakh": (34.1526, 77.5771),
    "rishikesh": (30.0869, 78.2676),
    "paris": (48.8566, 2.3522),
    "tokyo": (35.6762, 139.6503),
    "bali": (-8.4095, 115.1889),
    "dubai": (25.2048, 55.2708),
    "singapore": (1.3521, 103.8198),
    "london": (51.5074, -0.1278),
    "rome": (41.9028, 12.4964),
    "new york": (40.7128, -74.0060),
    "amritsar": (31.6340, 74.8723),
    "udaipur": (24.5854, 73.7125),
    "darjeeling": (27.0410, 88.2663),
    "pondicherry": (11.9416, 79.8083),
    "shimla": (31.1048, 77.1734),
    "bangkok": (13.7563, 100.5018),
    "amsterdam": (52.3676, 4.9041),
    "barcelona": (41.3851, 2.1734),
    "sydney": (-33.8688, 151.2093),
    "cairo": (30.0444, 31.2357),
    "maldives": (3.2028, 73.2207),
    "switzerland": (46.8182, 8.2275),
    "kyoto": (35.0116, 135.7681)
}


class DatasetManager:
    """Manages Pandas datasets and recommendation queries."""

    def __init__(self):
        self.traveler_df: Optional[pd.DataFrame] = None
        self.recommendation_df: Optional[pd.DataFrame] = None
        self.load_datasets()

    def load_datasets(self):
        try:
            if os.path.exists(TRAVELER_TRIP_CSV):
                self.traveler_df = pd.read_csv(TRAVELER_TRIP_CSV)
                logger.info(f"Loaded traveler_trip.csv with {len(self.traveler_df)} records.")
            if os.path.exists(TRAVEL_REC_CSV):
                self.recommendation_df = pd.read_csv(TRAVEL_REC_CSV)
                logger.info(f"Loaded travel_recommendation.csv with {len(self.recommendation_df)} records.")
        except Exception as e:
            logger.error(f"Error loading datasets: {e}")

    def get_destination_context(self, destination: str, interests: List[str]) -> Dict[str, Any]:
        """Finds matching attractions, hotels, and foods for a given destination."""
        context = {
            "attractions": [],
            "hotels": [],
            "foods": [],
            "center_lat": 20.5937,
            "center_lng": 78.9629
        }

        dest_clean = destination.strip().lower()

        # Coordinate lookup
        for key, coords in DESTINATION_COORDINATES.items():
            if key in dest_clean or dest_clean in key:
                context["center_lat"], context["center_lng"] = coords
                break

        if self.recommendation_df is not None and not self.recommendation_df.empty:
            matches = self.recommendation_df[
                self.recommendation_df["Destination"].str.lower().str.contains(dest_clean, na=False)
            ]
            if matches.empty and " " in dest_clean:
                first_word = dest_clean.split()[0]
                matches = self.recommendation_df[
                    self.recommendation_df["Destination"].str.lower().str.contains(first_word, na=False)
                ]

            if not matches.empty:
                # Update center coordinate if available in dataset
                first_row = matches.iloc[0]
                try:
                    context["center_lat"] = float(first_row.get("Latitude", context["center_lat"]))
                    context["center_lng"] = float(first_row.get("Longitude", context["center_lng"]))
                except Exception:
                    pass

                # Extract attractions
                for _, row in matches.iterrows():
                    context["attractions"].append({
                        "name": str(row.get("AttractionName", "")),
                        "category": str(row.get("Category", "Sightseeing")),
                        "lat": float(row.get("Latitude", context["center_lat"])),
                        "lng": float(row.get("Longitude", context["center_lng"])),
                        "entry_fee": float(row.get("EntryFeeINR", 0)),
                        "rating": float(row.get("Rating", 4.7)),
                        "hours": float(row.get("RecommendedHours", 2.0))
                    })

                    # Extract hotels
                    hotels_str = str(row.get("TopHotels", ""))
                    if hotels_str and hotels_str != "nan":
                        for h in hotels_str.split(","):
                            h_clean = h.strip()
                            if h_clean and h_clean not in context["hotels"]:
                                context["hotels"].append(h_clean)

                    # Extract foods
                    foods_str = str(row.get("SignatureLocalFood", ""))
                    if foods_str and foods_str != "nan":
                        for f in foods_str.split(","):
                            f_clean = f.strip()
                            if f_clean and f_clean not in context["foods"]:
                                context["foods"].append(f_clean)

        return context

    def calculate_budget_distribution(
        self,
        total_budget: float,
        days: int,
        travelers: int,
        travel_style: str,
        currency: str = "INR"
    ) -> Dict[str, Any]:
        """Calculates realistic budget breakdown based on travel style and duration."""
        style = travel_style.lower()

        if style == "luxury":
            ratios = {"accommodation": 0.45, "food": 0.22, "activities": 0.18, "transport": 0.10, "misc": 0.05}
            savings_tip = "Book five-star suites 30 days in advance or use credit card concierge privileges for free airport transfers."
        elif style == "budget" or style == "solo":
            ratios = {"accommodation": 0.30, "food": 0.25, "activities": 0.20, "transport": 0.15, "misc": 0.10}
            savings_tip = "Opt for youth hostels, shared scooters, and city transit passes to maximize activity spending."
        elif style == "family":
            ratios = {"accommodation": 0.38, "food": 0.24, "activities": 0.20, "transport": 0.12, "misc": 0.06}
            savings_tip = "Look for family combo attraction tickets and serviced apartments with breakfast inclusions."
        elif style == "business":
            ratios = {"accommodation": 0.42, "food": 0.25, "activities": 0.10, "transport": 0.18, "misc": 0.05}
            savings_tip = "Stay close to major business hubs and metro terminals to save on peak-hour taxi surges."
        else: # Moderate / Friends / Default
            ratios = {"accommodation": 0.36, "food": 0.24, "activities": 0.20, "transport": 0.12, "misc": 0.08}
            savings_tip = "Split taxi fares and group meal platters to enjoy premium dining at moderate prices."

        breakdown = {
            "accommodation": round(total_budget * ratios["accommodation"], 2),
            "food": round(total_budget * ratios["food"], 2),
            "activities": round(total_budget * ratios["activities"], 2),
            "transport": round(total_budget * ratios["transport"], 2),
            "miscellaneous": round(total_budget * ratios["misc"], 2),
            "total": round(total_budget, 2),
            "currency": currency,
            "perPersonCost": round(total_budget / max(1, travelers), 2),
            "savingsTip": savings_tip
        }
        return breakdown


# Singleton dataset manager instance
dataset_manager = DatasetManager()


if REPORTLAB_AVAILABLE:
    class NumberedCanvas(canvas.Canvas):
        """Adds professional page numbers and subtle header/footer rules."""
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self._saved_page_states = []

        def showPage(self):
            self._saved_page_states.append(dict(self.__dict__))
            self._startPage()

        def save(self):
            num_pages = len(self._saved_page_states)
            for state in self._saved_page_states:
                self.__dict__.update(state)
                self.draw_page_decorations(num_pages)
                super().showPage()
            super().save()

        def draw_page_decorations(self, page_count):
            self.saveState()
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))

            # Footer
            footer_text = f"TripGenie AI Itinerary Planner  •  Page {self._pageNumber} of {page_count}"
            self.drawCentredString(letter[0] / 2.0, 25, footer_text)
            
            # Bottom rule
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(40, 38, letter[0] - 40, 38)
            
            self.restoreState()


def build_pdf_itinerary(trip_data: Dict[str, Any]) -> bytes:
    """Generates a high-end, styled travel itinerary PDF using ReportLab."""
    if not REPORTLAB_AVAILABLE:
        # Minimal valid PDF stream fallback
        content = f"TripGenie Itinerary for {trip_data.get('destination')}\n\nSummary:\n{trip_data.get('summary', '')}"
        pdf_raw = (
            b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
            b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
            b"3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n"
            b"xref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000115 00000 n \n"
            b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"
        )
        return pdf_raw

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=50
    )


    styles = getSampleStyleSheet()

    # Custom typography & colors
    primary_color = colors.HexColor("#312e81")    # Indigo 900
    accent_color = colors.HexColor("#4f46e5")     # Indigo 600
    text_dark = colors.HexColor("#0f172a")        # Slate 900
    text_muted = colors.HexColor("#475569")       # Slate 600
    card_bg = colors.HexColor("#f8fafc")          # Slate 50
    border_color = colors.HexColor("#cbd5e1")     # Slate 300

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=accent_color,
        spaceAfter=12
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6
    )

    day_heading_style = ParagraphStyle(
        'DayHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1e1b4b"),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=text_dark,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=text_dark,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    story = []

    # 1. Header Banner Box
    destination = trip_data.get("destination", "Custom Trip")
    days = trip_data.get("days", 3)
    travel_style = trip_data.get("travelStyle", "Vacation")
    travelers = trip_data.get("travelers", 1)
    budget = trip_data.get("budget", 0)
    currency = trip_data.get("currency", "INR")
    start_date = trip_data.get("startDate") or "Flexible Dates"
    interests = trip_data.get("interests", [])
    interests_str = ", ".join(interests) if isinstance(interests, list) else str(interests)

    story.append(Paragraph(f"✈ {destination.upper()} ITINERARY", title_style))
    story.append(Paragraph(f"AI-Crafted {days}-Day {travel_style} Adventure  •  {travelers} Traveler(s)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_color, spaceBefore=2, spaceAfter=10))

    # 2. Trip Metadata Table
    meta_data = [
        [
            Paragraph("<b>Destination:</b>", body_style), Paragraph(str(destination), body_style),
            Paragraph("<b>Duration:</b>", body_style), Paragraph(f"{days} Days", body_style)
        ],
        [
            Paragraph("<b>Total Budget:</b>", body_style), Paragraph(f"{currency} {budget:,.0f}", body_style),
            Paragraph("<b>Travel Style:</b>", body_style), Paragraph(str(travel_style), body_style)
        ],
        [
            Paragraph("<b>Start Date:</b>", body_style), Paragraph(str(start_date), body_style),
            Paragraph("<b>Interests:</b>", body_style), Paragraph(str(interests_str), body_style)
        ]
    ]

    meta_table = Table(meta_data, colWidths=[1.1*inch, 2.3*inch, 1.1*inch, 2.3*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 3. Trip Summary
    summary = trip_data.get("summary", "")
    if summary:
        story.append(Paragraph("📌 Executive Summary", heading_style))
        story.append(Paragraph(summary, body_style))
        story.append(Spacer(1, 8))

    # 4. Budget Breakdown Table
    budget_info = trip_data.get("budgetBreakdown", {})
    if isinstance(budget_info, dict) and budget_info:
        story.append(Paragraph("💰 Estimated Budget Breakdown", heading_style))
        
        b_curr = budget_info.get("currency", currency)
        b_acc = budget_info.get("accommodation", 0)
        b_food = budget_info.get("food", 0)
        b_act = budget_info.get("activities", 0)
        b_trans = budget_info.get("transport", 0)
        b_misc = budget_info.get("miscellaneous", 0)
        b_tot = budget_info.get("total", budget)

        budget_table_data = [
            [Paragraph("<b>Category</b>", body_style), Paragraph("<b>Estimated Allocation</b>", body_style), Paragraph("<b>Share</b>", body_style)],
            [Paragraph("🏨 Accommodation & Stays", body_style), Paragraph(f"{b_curr} {b_acc:,.0f}", body_style), Paragraph(f"{b_acc/max(1,b_tot)*100:.1f}%", body_style)],
            [Paragraph("🍽 Food & Local Dining", body_style), Paragraph(f"{b_curr} {b_food:,.0f}", body_style), Paragraph(f"{b_food/max(1,b_tot)*100:.1f}%", body_style)],
            [Paragraph("🎟 Activities & Sightseeing", body_style), Paragraph(f"{b_curr} {b_act:,.0f}", body_style), Paragraph(f"{b_act/max(1,b_tot)*100:.1f}%", body_style)],
            [Paragraph("🚕 Local Transport & Cabs", body_style), Paragraph(f"{b_curr} {b_trans:,.0f}", body_style), Paragraph(f"{b_trans/max(1,b_tot)*100:.1f}%", body_style)],
            [Paragraph("🛍 Miscellaneous / Buffer", body_style), Paragraph(f"{b_curr} {b_misc:,.0f}", body_style), Paragraph(f"{b_misc/max(1,b_tot)*100:.1f}%", body_style)],
            [Paragraph("<b>Total Estimated Budget</b>", body_style), Paragraph(f"<b>{b_curr} {b_tot:,.0f}</b>", body_style), Paragraph("<b>100.0%</b>", body_style)]
        ]

        b_table = Table(budget_table_data, colWidths=[3.2*inch, 2.2*inch, 1.4*inch])
        b_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e0e7ff")),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#e0e7ff")),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(b_table)
        
        savings_tip = budget_info.get("savingsTip")
        if savings_tip:
            story.append(Spacer(1, 4))
            story.append(Paragraph(f"💡 <i><b>Budget Tip:</b> {savings_tip}</i>", ParagraphStyle('Tip', parent=body_style, fontSize=8.5, textColor=colors.HexColor("#065f46"))))
        story.append(Spacer(1, 10))

    # 5. Day-by-Day Itinerary Plan
    day_plans = trip_data.get("dayPlans", [])
    if day_plans:
        story.append(Paragraph("🗓 Day-by-Day Master Schedule", heading_style))

        for dp in day_plans:
            d_num = dp.get("day", 1)
            d_title = dp.get("title", f"Day {d_num}")
            d_morning = dp.get("morning", "")
            d_afternoon = dp.get("afternoon", "")
            d_evening = dp.get("evening", "")

            day_elements = [
                Paragraph(f"<b>Day {d_num}: {d_title}</b>", day_heading_style),
                Paragraph(f"• <b>Morning:</b> {d_morning}", bullet_style),
                Paragraph(f"• <b>Afternoon:</b> {d_afternoon}", bullet_style),
                Paragraph(f"• <b>Evening:</b> {d_evening}", bullet_style),
                Spacer(1, 6)
            ]
            story.append(KeepTogether(day_elements))

    # 6. Tips, Foods, Packing & Emergency Grid
    story.append(Spacer(1, 6))
    story.append(Paragraph("🧳 Travel Insights & Essentials", heading_style))

    foods = trip_data.get("bestLocalFoods", [])
    tips = trip_data.get("travelTips", [])
    packing = trip_data.get("packingSuggestions", [])
    emergency = trip_data.get("emergencyContacts", [])

    if foods:
        story.append(Paragraph("<b>Signature Local Foods to Try:</b>", ParagraphStyle('Sub', parent=body_style, fontName='Helvetica-Bold')))
        for f in foods:
            story.append(Paragraph(f"• {f}", bullet_style))
        story.append(Spacer(1, 4))

    if tips:
        story.append(Paragraph("<b>Key Travel Tips:</b>", ParagraphStyle('Sub', parent=body_style, fontName='Helvetica-Bold')))
        for t in tips:
            story.append(Paragraph(f"• {t}", bullet_style))
        story.append(Spacer(1, 4))

    if packing:
        story.append(Paragraph("<b>Recommended Packing List:</b>", ParagraphStyle('Sub', parent=body_style, fontName='Helvetica-Bold')))
        for p in packing:
            story.append(Paragraph(f"• {p}", bullet_style))
        story.append(Spacer(1, 4))

    if emergency:
        story.append(Paragraph("<b>Emergency Contacts & Helplines:</b>", ParagraphStyle('Sub', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#991b1b"))))
        for e in emergency:
            story.append(Paragraph(f"• {e}", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
