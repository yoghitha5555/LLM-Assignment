import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import {
  BookmarkPlus,
  FileDown,
  ArrowLeft,
  Share2,
  Sparkles,
  Check,
  RotateCcw,
  Calendar,
  Users,
  Compass,
  Download
} from 'lucide-react';

import ItineraryCard from '../components/ItineraryCard';
import BudgetCard from '../components/BudgetCard';
import MapView from '../components/MapView';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(() => {
    return location.state?.trip || null;
  });

  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Save to session storage as fallback
    if (location.state?.trip) {
      sessionStorage.setItem('current_trip', JSON.stringify(location.state.trip));
      setTrip(location.state.trip);
    } else {
      const cached = sessionStorage.getItem('current_trip');
      if (cached) {
        try {
          setTrip(JSON.parse(cached));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [location.state]);

  const handleSaveTrip = async () => {
    if (!trip) return;
    setSaving(true);
    try {
      const response = await axios.post('/api/save', trip);
      setIsSaved(true);
      toast.success('Trip itinerary successfully saved to MongoDB database!');
      
      // Update local storage backup
      const localSaved = JSON.parse(localStorage.getItem('saved_trips') || '[]');
      const updated = [response.data.trip || trip, ...localSaved.filter((t) => t.id !== trip.id)];
      localStorage.setItem('saved_trips', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving trip:', error);
      toast.error('Failed to save trip to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!trip) return;
    setExportingPdf(true);
    const toastId = toast.loading('Compiling ReportLab PDF Itinerary...');

    try {
      const response = await axios.post('/api/export-pdf', trip, {
        responseType: 'blob',
      });

      // Create blob download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeDest = (trip.destination || 'Travel').replace(/\s+/g, '_');
      link.download = `TripGenie_${safeDest}_Itinerary.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF Itinerary downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    } finally {
      setExportingPdf(false);
    }
  };

  if (!trip) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            No Active Itinerary Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Please fill out the Trip Planner form to generate a personalized AI itinerary.
          </p>
          <Link
            to="/#planner"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl gradient-bg font-semibold text-sm shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create a Trip</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800 mb-8">
        
        {/* Back Link & Title */}
        <div>
          <button
            onClick={() => navigate('/#planner')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Plan Another Journey</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white flex items-center gap-3">
            <span>{trip.destination}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
              {trip.days} Days
            </span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Save Trip Button */}
          <button
            onClick={handleSaveTrip}
            disabled={saving || isSaved}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm ${
              isSaved
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            <span>{isSaved ? 'Saved in MongoDB' : saving ? 'Saving...' : 'Save Trip'}</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            disabled={exportingPdf}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold gradient-bg shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 ${
              exportingPdf ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Download className="w-4 h-4 text-white" />
            <span>{exportingPdf ? 'Compiling PDF...' : 'Export Itinerary to PDF'}</span>
          </button>

        </div>

      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Day Plans, Foods, Tips, Packing, Contacts) */}
        <div className="lg:col-span-7 space-y-8">
          <ItineraryCard trip={trip} />
        </div>

        {/* Right Column (Budget Breakdown + Interactive Map) */}
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          
          {/* Budget Estimation Card */}
          <BudgetCard
            budgetBreakdown={trip.budgetBreakdown}
            travelers={trip.travelers}
          />

          {/* Interactive Leaflet Map View */}
          <MapView
            destination={trip.destination}
            mapPoints={trip.mapPoints || []}
          />

        </div>

      </div>

    </div>
  );
}
