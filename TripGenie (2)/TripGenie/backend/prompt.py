"""
TripGenie - Prompt Engineering Module
Implements Few-Shot Prompting, system role definition, and structured outputs for OpenAI GPT Transformer models.
"""

from typing import List, Optional, Dict, Any


SYSTEM_PROMPT = """You are TripGenie, an expert AI Travel Planner and Concierge specializing in generating personalized, practical, high-value day-wise travel itineraries.
You use few-shot context and deep domain knowledge of global tourism, geography, budgeting, and local culture to craft realistic schedules.

When generating an itinerary:
1. Respect the traveler's budget, duration, group size, and travel style.
2. Structure the day with realistic time management: Morning, Afternoon, and Evening.
3. Include specific names of attractions, restaurants, viewpoints, and cultural experiences.
4. Provide actionable travel tips, packing advice tailored to climate/activities, local culinary highlights, and emergency contacts.
5. Return output formatted with Markdown and a final valid JSON block delimited by ```json ... ``` that can be parsed by client applications.
"""

FEW_SHOT_EXAMPLES = [
    {
        "input": {
            "destination": "Goa",
            "budget": "30000 INR",
            "days": 3,
            "travelStyle": "Friends",
            "travelers": 3,
            "interests": ["Beach", "Nightlife", "Food"]
        },
        "output": """### Trip Summary
A 3-day vibrant coastal escape in North & South Goa tailored for friends, balancing beach parties, water sports, Portuguese heritage, and delicious seafood.

### Estimated Budget
- **Accommodation:** ₹12,000 (Boutique beach resort / villa in Calangute)
- **Food & Dining:** ₹7,000 (Beach shacks, local Goan curries, seafood dinners)
- **Activities & Entry:** ₹6,000 (Water sports, Fort Aguada entry)
- **Local Transport:** ₹5,000 (Scooter / self-drive Thar rental & fuel)
- **Total Estimated Cost:** ₹30,000

---

### Day 1: Sun, Sand & Sunset Beats in Calangute
- **Morning:** Check-in at hotel, freshen up, and head to Calangute Beach. Enjoy a relaxed breakfast of Goan Poi and fresh watermelon juice at a seaside shack.
- **Afternoon:** Indulge in parasailing and jet-skiing. Head to Fisherman's Wharf for lunch (Kingfish Thali & Prawn Balchao).
- **Evening:** Stroll down Baga Beach, explore the night flea market stalls, and relax with live acoustic music at Tito's Lane.

### Day 2: Heritage Forts & Ocean Adventures
- **Morning:** Early morning boat ride for dolphin watching. Visit the 17th-century Portuguese Fort Aguada and its historic lighthouse.
- **Afternoon:** Savor Goan Fish Curry and Bebinca at Viva Panjim in Latin Quarter Fontainhas.
- **Evening:** Sunset cruise on the Mandovi River with traditional Goan folk dance performances followed by beach club dining at Curlies Anjuna.

### Day 3: Flea Markets, Spice Fragrance & Farewell
- **Morning:** Visit Anjuna Flea Market for souvenir shopping (boho apparel, handcrafted brassware, spices).
- **Afternoon:** Authentic Goan lunch at Martin's Corner. Relax at Miramar Beach.
- **Evening:** Pack bags, take final ocean photos, and transfer to Goa Dabolim/Mopa Airport or Madgaon station.

---

### Travel Tips
- Rent scooters or a hatchback early in the morning for the most affordable daily rates.
- Keep cash handy as beach shacks often face spotty mobile network signals.

### Packing Suggestions
- UV sunscreen (SPF 50+), quick-dry swimwear, polaroid sunglasses, flip-flops, and cotton linen shirts.

### Emergency Contacts
- Goa Police Tourist Helpline: 1364 / 112
- Goa Medical Emergency: 108
- Goa Tourism Development Corp (GTDC): +91 832 2438750

### Best Local Foods
- Goan Prawn Curry with Rice
- Pork / Chicken Vindaloo
- Bebinca (Traditional layered dessert)
- Feni Cocktail with Limca
"""
    },
    {
        "input": {
            "destination": "Ooty",
            "budget": "15000 INR",
            "days": 2,
            "travelStyle": "Couple",
            "travelers": 2,
            "interests": ["Nature", "Sightseeing", "Food"]
        },
        "output": """### Trip Summary
A romantic 2-day tranquil hill station getaway in the Nilgiris (Ooty), featuring lush botanical gardens, misty mountain peaks, tea tasting, and serene lakeside boating.

### Estimated Budget
- **Accommodation:** ₹6,000 (Heritage colonial cottage near Nilgiri hills)
- **Food & Dining:** ₹3,500 (Homemade Nilgiri chocolates, South Indian thalis, English teas)
- **Activities & Entry:** ₹3,000 (Botanical Garden, Lake boating, Doddabetta telescope entry)
- **Local Transport:** ₹2,500 (Local taxi & auto-rickshaws)
- **Total Estimated Cost:** ₹15,000

---

### Day 1: Misty Gardens & Aromatic Tea Terraces
- **Morning:** Check into hotel. Stroll through the lush 55-acre Government Botanical Garden admiring exotic flora, Italian gardens, and fossil tree trunks.
- **Afternoon:** Visit the Nilgiri Tea Factory & Museum. Witness tea leaf processing and sip freshly brewed green tea and cardamom spiced tea with warm Varkey biscuits.
- **Evening:** Drive to Doddabetta Peak (2,637 m) for breathtaking sunset views over the Nilgiri ranges. Dinner with hot soup and Chettinad delicacies.

### Day 2: Serene Waters & Colonial Heritage
- **Morning:** Relaxing walk along Ooty Lake followed by a peaceful pedal-boat ride amidst the morning eucalyptus mist.
- **Afternoon:** Lunch at Earl's Secret (colonial fine dining). Shop for homemade artisan dark chocolates, eucalyptus oil, and gourmet spices on Commercial Road.
- **Evening:** Take the iconic Nilgiri Mountain Railway (Toy Train) joyride from Ooty to Coonoor through tunnels and pine forests before return departure.

---

### Travel Tips
- Book Nilgiri Toy Train tickets in advance through IRCTC as seats sell out weeks ahead.
- Carry a light jacket or woolen sweater as evening temperatures drop rapidly.

### Packing Suggestions
- Woolen shawls or fleece jackets, comfortable walking sneakers, thermal flask, and lip balm.

### Emergency Contacts
- Ooty Tourist Helpline: 0423-2443977
- Nilgiris Emergency & Medical: 108 / 112
- Government Hospital Ooty: 0423-2442212

### Best Local Foods
- Ooty Homemade Dark & Milk Chocolates
- Hot Nilgiri Spiced Tea
- Crispy Ooty Varkey with Filter Coffee
- Nilgiri Korma with Malabar Parotta
"""
    }
]


def build_few_shot_prompt(
    destination: str,
    budget: float,
    currency: str,
    days: int,
    travelStyle: str,
    travelers: int,
    interests: List[str],
    startDate: Optional[str] = None,
    dataset_context: Optional[Dict[str, Any]] = None
) -> str:
    """
    Constructs an optimized prompt using Few-Shot examples, dataset recommendations,
    and strict formatting specifications.
    """
    interests_str = ", ".join(interests) if interests else "General Sightseeing"
    start_date_str = f"Starting on: {startDate}" if startDate else "Flexible Dates"

    # Context enrichment from dataset if available
    recommendation_hint = ""
    if dataset_context:
        attractions = dataset_context.get("attractions", [])
        hotels = dataset_context.get("hotels", [])
        foods = dataset_context.get("foods", [])

        if attractions:
            attractions_names = ", ".join([a.get("name", "") for a in attractions[:5]])
            recommendation_hint += f"\n- Curated Top Attractions: {attractions_names}"
        if hotels:
            hotels_names = ", ".join(hotels[:3])
            recommendation_hint += f"\n- Recommended Hotels: {hotels_names}"
        if foods:
            foods_names = ", ".join(foods[:4])
            recommendation_hint += f"\n- Notable Local Foods: {foods_names}"

    examples_block = ""
    for idx, ex in enumerate(FEW_SHOT_EXAMPLES, 1):
        inp = ex["input"]
        examples_block += f"""### [Few-Shot Example {idx}]
Input:
Destination: {inp['destination']}
Budget: {inp['budget']}
Days: {inp['days']}
Travel Style: {inp['travelStyle']}
Travelers: {inp['travelers']}
Interests: {', '.join(inp['interests'])}

Output:
{ex['output']}

----------------------------
"""

    prompt = f"""You are generating an AI travel itinerary using Few-Shot Prompting.
Learn from the structure, tone, and granularity of the examples below, then generate the complete itinerary for the new user request.

{examples_block}

Now generate a comprehensive, highly personalized day-wise itinerary for:

Destination: {destination}
Budget: {budget:,.0f} {currency}
Days: {days}
Travel Style: {travelStyle}
Travelers: {travelers}
Interests: {interests_str}
{start_date_str}
{f"Dataset Context Suggestions:{recommendation_hint}" if recommendation_hint else ""}

REQUIREMENTS:
1. Provide a detailed, realistic day-by-day plan for all {days} days (split into Morning, Afternoon, Evening).
2. Distribute the budget realistically into: Accommodation, Food, Activities, Transport, and Miscellaneous (total must closely match {budget:,.0f} {currency}).
3. Include curated Travel Tips, Packing Suggestions, Emergency Contacts, and Best Local Foods.
4. At the very end of your response, output a strict JSON block enclosed in ```json and ``` with this exact structure:
```json
{{
  "summary": "Brief 2-line summary",
  "budgetBreakdown": {{
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transport": 0,
    "miscellaneous": 0,
    "total": {budget},
    "currency": "{currency}",
    "savingsTip": "Tip to save money on this trip"
  }},
  "dayPlans": [
    {{
      "day": 1,
      "title": "Day 1 headline",
      "morning": "Morning activities",
      "afternoon": "Afternoon activities",
      "evening": "Evening activities"
    }}
  ],
  "mapPoints": [
    {{
      "id": "pt-1",
      "name": "Attraction or Hotel Name",
      "category": "Historical / Beach / Nature / Hotel / Food / Adventure",
      "lat": 0.0,
      "lng": 0.0,
      "description": "Short description",
      "rating": 4.8
    }}
  ],
  "travelTips": ["Tip 1", "Tip 2", "Tip 3"],
  "packingSuggestions": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "emergencyContacts": ["Police Helpline: 112", "Medical: 108"],
  "bestLocalFoods": ["Food 1", "Food 2", "Food 3"]
}}
```

Ensure the markdown is rich, inspiring, well-spaced, and the embedded JSON is 100% valid JSON.
"""
    return prompt
