import React, { useState } from 'react';
import {
  GraduationCap,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Code2,
  FileCode2,
  CheckCircle,
  MapPin,
  FileText
} from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('prompting');

  const fewShotCode = `# prompt.py - Few-Shot In-Context Prompt Engineering Architecture

SYSTEM_PROMPT = """You are TripGenie, an expert AI Travel Planner and Concierge.
You use few-shot context and deep domain knowledge of global tourism, geography,
budgeting, and local culture to craft realistic schedules."""

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
A 3-day vibrant coastal escape in North & South Goa tailored for friends...
### Day 1: Sun, Sand & Sunset Beats in Calangute
- Morning: Check-in, Calangute Beach...
- Afternoon: Parasailing, Seafood lunch...
- Evening: Baga Beach & Tito's Lane night market..."""
    },
    {
        "input": {
            "destination": "Ooty",
            "budget": "15000 INR",
            "days": 2,
            "travelStyle": "Couple",
            "travelers": 2,
            "interests": ["Nature", "Food"]
        },
        "output": """### Trip Summary
A romantic 2-day tranquil hill station getaway in the Nilgiris (Ooty)...
### Day 1: Misty Gardens & Aromatic Tea Terraces
- Morning: Botanical Garden walk...
- Afternoon: Nilgiri Tea Factory & Museum tasting...
- Evening: Doddabetta Peak sunset..."""
    }
]`;

  const architectureFlow = [
    {
      title: 'User Input & Preferences',
      desc: 'Destination, budget, duration, travel style, group size, and interest checkboxes.',
    },
    {
      title: 'Pandas Dataset Enrichment',
      desc: 'Retrieves verified attractions, geo-coordinates, top hotels, and signature local foods.',
    },
    {
      title: 'Few-Shot Transformer Prompting',
      desc: 'Constructs structured prompts with exemplar I/O pairs for high-fidelity text generation.',
    },
    {
      title: 'OpenAI GPT-4o-mini Inference',
      desc: 'Transformer model outputs rich Markdown itinerary with structured JSON metadata.',
    },
    {
      title: 'Multi-Modal Presentation',
      desc: 'Interactive Leaflet map pins, Chart.js budget doughnut, and ReportLab PDF compilation.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-4 border border-indigo-200 dark:border-indigo-800">
          <GraduationCap className="w-4 h-4" />
          <span>University Assignment: Text Generation using Transformer Models</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-display text-slate-900 dark:text-white">
          TripGenie Technical Documentation
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          Comprehensive project overview detailing Few-Shot Prompt Engineering, Transformer model integration,
          dataset analytics, and full-stack software architecture.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-x-2">
          <button
            onClick={() => setActiveTab('prompting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prompting'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Few-Shot Prompting
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dataset'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dataset & Analytics
          </button>
        </div>
      </div>

      {/* Tab 1: Few-Shot Prompting */}
      {activeTab === 'prompting' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Few-Shot In-Context Learning</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Few-Shot Prompting is a technique where targeted input-output exemplars are included in the prompt
                context before presenting the actual user query. This guides the Transformer's attention mechanism to
                generate outputs matching the intended day-by-day granularity, tone, and JSON schema without requiring parameter fine-tuning.
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300">
                  <span className="font-bold">System Role:</span> Constrains the model persona to an authoritative, safety-aware travel concierge.
                </div>
                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-300">
                  <span className="font-bold">Exemplars Included:</span> Goa Beach Escape (3 Days) and Ooty Nature Retreat (2 Days).
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-300">
                  <span className="font-bold">Dual Output Format:</span> Emits human-readable Markdown accompanied by strict JSON blocks for Leaflet and Chart.js.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="glass-card rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" />
                  backend/prompt.py
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Python 3.10+</span>
              </div>
              <pre className="text-[11px] font-mono leading-relaxed bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto border border-slate-800">
                {fewShotCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: System Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {architectureFlow.map((step, idx) => (
              <div
                key={idx}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative shadow-sm"
              >
                <span className="w-7 h-7 rounded-lg gradient-bg text-white text-xs font-bold flex items-center justify-center mb-3">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">
              Technology Stack Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Frontend Layer</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">React 18, Vite, Tailwind CSS, React Router, Axios, Lucide Icons</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-purple-600 dark:text-purple-400">Backend API</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">FastAPI, Pydantic v2, Uvicorn, Python-Dotenv, AsyncIO</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Persistence & AI</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">MongoDB (Motor async), OpenAI GPT-4o-mini, ReportLab PDF Engine</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-sky-600 dark:text-sky-400">Visuals & Geo</span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Leaflet OpenStreetMap, Chart.js Doughnut Charts, Canvas Confetti</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dataset & Analytics */}
      {activeTab === 'dataset' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              traveler_trip.csv
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
              Contains historical user travel profiles, group types, budget allocations, and satisfaction scores
              across 30+ destinations. Used by Pandas to predict realistic cost distributions.
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300">
              Columns: TripID, Destination, DurationDays, TravelerType, BudgetTier, TotalBudgetINR, AccommodationCostINR, ActivityCostINR, FoodCostINR, TransportCostINR, Interests, Rating
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              travel_recommendation.csv
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
              Curated tourism knowledge base containing landmark geo-coordinates (latitude/longitude),
              entry fees, top recommended hotels, and signature culinary highlights.
            </p>
            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300">
              Columns: Destination, AttractionName, Category, Latitude, Longitude, EntryFeeINR, RecommendedHours, Rating, TopHotels, SignatureLocalFood
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
