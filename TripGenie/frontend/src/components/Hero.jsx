import React from 'react';
import { Sparkles, MapPin, Compass, ShieldCheck, Zap, ArrowDown, Users, DollarSign } from 'lucide-react';

export default function Hero({ onSelectDestination }) {
  const quickDestinations = [
    { name: 'Goa', tag: '🏖 Beach & Sunset', budget: '₹30,000' },
    { name: 'Paris', tag: '🗼 Art & Romance', budget: '₹2,20,000' },
    { name: 'Tokyo', tag: '⛩ Culture & Food', budget: '₹2,00,000' },
    { name: 'Ooty', tag: '⛰ Hills & Tea', budget: '₹15,000' },
    { name: 'Bali', tag: '🌴 Tropical Adventure', budget: '₹80,000' },
    { name: 'Manali', tag: '❄ Himalayan Snow', budget: '₹35,000' },
  ];

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-3/4 -translate-y-1/2 w-72 h-72 bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Few-Shot AI Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <span>Few-Shot Transformer Prompt Architecture</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-slate-500 dark:text-slate-400 font-normal">University Assignment Edition</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Design Your Perfect Journey with{' '}
          <span className="gradient-text block sm:inline">TripGenie AI</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Generate complete, day-wise itineraries in seconds. Powered by OpenAI Transformer models,
          custom dataset recommendations, interactive Leaflet maps, and instant PDF exports.
        </p>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="glass-card p-3.5 rounded-xl text-center">
            <p className="text-2xl font-bold font-display text-indigo-600 dark:text-indigo-400">100%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Few-Shot AI Tailored</p>
          </div>
          <div className="glass-card p-3.5 rounded-xl text-center">
            <p className="text-2xl font-bold font-display text-purple-600 dark:text-purple-400">30+ Cities</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dataset Enriched</p>
          </div>
          <div className="glass-card p-3.5 rounded-xl text-center">
            <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">Smart Map</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">GPS Geo Coordinates</p>
          </div>
          <div className="glass-card p-3.5 rounded-xl text-center">
            <p className="text-2xl font-bold font-display text-cyan-600 dark:text-cyan-400">ReportLab</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Direct PDF Export</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToPlanner}
            className="w-full sm:w-auto px-8 py-4 rounded-xl gradient-bg font-semibold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Itinerary Now</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

        {/* Quick Picks */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Popular Quick Destinations (Click to auto-fill)
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickDestinations.map((d) => (
              <button
                key={d.name}
                onClick={() => onSelectDestination && onSelectDestination(d.name)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold">{d.name}</span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-slate-500 dark:text-slate-400">{d.tag}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
