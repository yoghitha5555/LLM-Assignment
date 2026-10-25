import React, { useState } from 'react';
import {
  Sun,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
  Lightbulb,
  Briefcase,
  Utensils,
  PhoneCall,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ItineraryCard({ trip }) {
  const [expandedDays, setExpandedDays] = useState(() => {
    // Open all days by default
    const all = {};
    (trip?.dayPlans || []).forEach((_, idx) => {
      all[idx] = true;
    });
    return all;
  });
  const [copied, setCopied] = useState(false);
  const [checkedPacking, setCheckedPacking] = useState({});

  if (!trip) return null;

  const toggleDay = (idx) => {
    setExpandedDays((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const expandAll = () => {
    const all = {};
    (trip?.dayPlans || []).forEach((_, idx) => {
      all[idx] = true;
    });
    setExpandedDays(all);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  const handleCopy = () => {
    if (trip?.generatedItineraryMarkdown) {
      navigator.clipboard.writeText(trip.generatedItineraryMarkdown);
      setCopied(true);
      toast.success('Itinerary copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const togglePackingItem = (idx) => {
    setCheckedPacking((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                {trip.days} Days • {trip.travelStyle} • {trip.travelers} Traveler(s)
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {trip.source || 'OpenAI Transformer Engine'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-2">
              {trip.destination} Travel Master Plan
            </h2>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
              title="Copy Itinerary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* Trip Summary Paragraph */}
        {trip.summary && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Trip Summary</span>
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {trip.summary}
            </p>
          </div>
        )}

        {/* Interests & Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Focus Areas:</span>
          {(trip.interests || []).map((interest, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60"
            >
              #{interest}
            </span>
          ))}
        </div>
      </div>

      {/* Day-by-Day Accordion Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <span>🗓 Daily Schedule</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              {trip.dayPlans?.length || 0} Days
            </span>
          </h3>

          <div className="flex space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <button onClick={expandAll} className="hover:underline">Expand All</button>
            <span>•</span>
            <button onClick={collapseAll} className="hover:underline">Collapse All</button>
          </div>
        </div>

        {/* Day Cards */}
        {(trip.dayPlans || []).map((dayPlan, idx) => {
          const isExpanded = !!expandedDays[idx];
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800 transition-all duration-200"
            >
              {/* Day Header Trigger */}
              <button
                onClick={() => toggleDay(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center font-black text-sm text-white shadow-md shadow-indigo-500/20 shrink-0">
                    D{dayPlan.day || idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {dayPlan.title || `Day ${dayPlan.day || idx + 1}`}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Morning, Afternoon & Evening Schedule
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 dark:text-slate-500">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Day Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                  
                  {/* Morning */}
                  <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                      <Sunrise className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        Morning
                      </h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {dayPlan.morning}
                      </p>
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
                    <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                        Afternoon
                      </h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {dayPlan.afternoon}
                      </p>
                    </div>
                  </div>

                  {/* Evening */}
                  <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                      <Sunset className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                        Evening
                      </h5>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {dayPlan.evening}
                      </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grid for Foods, Tips, Packing & Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Local Foods */}
        {trip.bestLocalFoods?.length > 0 && (
          <div className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Utensils className="w-4 h-4 text-emerald-500" />
              <span>Signature Local Dishes</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {trip.bestLocalFoods.map((food, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <span>🍽</span>
                  <span>{food}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Travel Tips */}
        {trip.travelTips?.length > 0 && (
          <div className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Smart Travel Tips</span>
            </h4>
            <ul className="space-y-2.5">
              {trip.travelTips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Packing Checklist */}
        {trip.packingSuggestions?.length > 0 && (
          <div className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              <span>Recommended Packing List</span>
            </h4>
            <div className="space-y-2">
              {trip.packingSuggestions.map((item, i) => {
                const isChecked = !!checkedPacking[i];
                return (
                  <button
                    key={i}
                    onClick={() => togglePackingItem(i)}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span
                      className={`text-xs ${
                        isChecked
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        {trip.emergencyContacts?.length > 0 && (
          <div className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <PhoneCall className="w-4 h-4 text-rose-500" />
              <span>Emergency Helpline Directory</span>
            </h4>
            <div className="space-y-2.5">
              {trip.emergencyContacts.map((contact, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center justify-between"
                >
                  <span>{contact}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
