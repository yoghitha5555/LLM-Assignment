import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BookmarkCheck,
  Search,
  Filter,
  Trash2,
  FileDown,
  Eye,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Compass,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SavedTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/trips');
      let backendTrips = response.data?.trips || [];

      // Reconcile with local storage if backend returned empty
      if (backendTrips.length === 0) {
        const local = JSON.parse(localStorage.getItem('saved_trips') || '[]');
        backendTrips = local;
      }

      setTrips(backendTrips);
    } catch (error) {
      console.error('Error fetching trips from backend:', error);
      // Fallback to local storage
      const local = JSON.parse(localStorage.getItem('saved_trips') || '[]');
      setTrips(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this saved itinerary?')) return;

    try {
      await axios.delete(`/api/trips/${tripId}`);
      toast.success('Trip removed successfully');
    } catch (error) {
      console.error('Delete error:', error);
    }

    // Update state and local storage
    const updated = trips.filter((t) => (t.id || t._id) !== tripId);
    setTrips(updated);
    localStorage.setItem('saved_trips', JSON.stringify(updated));
  };

  const handleDownloadPDF = async (trip) => {
    const tripId = trip.id || trip._id;
    setDownloadingId(tripId);
    const toastId = toast.loading('Generating PDF document...');

    try {
      const response = await axios.post('/api/export-pdf', trip, {
        responseType: 'blob',
      });

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

      toast.success('PDF downloaded!', { id: toastId });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to export PDF', { id: toastId });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = (trip) => {
    sessionStorage.setItem('current_trip', JSON.stringify(trip));
    navigate('/result', { state: { trip } });
  };

  const stylesList = ['All', 'Solo', 'Couple', 'Family', 'Friends', 'Business'];

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle =
      selectedStyle === 'All' ||
      t.travelStyle?.toLowerCase() === selectedStyle.toLowerCase();
    return matchesSearch && matchesStyle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 min-h-[80vh]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2 border border-indigo-200 dark:border-indigo-800">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>MongoDB Database Storage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
            Saved Travel Itineraries
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your previously generated AI plans, download PDFs, or review schedules.
          </p>
        </div>

        <Link
          to="/#planner"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl gradient-bg font-semibold text-xs shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by destination or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Style Filter Tabs */}
        <div className="sm:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {stylesList.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStyle(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStyle === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid / Empty State */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading saved itineraries...</p>
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="glass-card max-w-md mx-auto p-8 rounded-2xl text-center shadow-lg border border-slate-200 dark:border-slate-800 my-12">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            {searchQuery || selectedStyle !== 'All' ? 'No Matching Trips' : 'No Saved Itineraries Yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
            {searchQuery || selectedStyle !== 'All'
              ? 'Try changing your search terms or filter selection.'
              : 'Generate an itinerary and click "Save Trip" to store it in your database.'}
          </p>
          <Link
            to="/#planner"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl gradient-bg font-semibold text-xs shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((t) => {
            const tripId = t.id || t._id;
            return (
              <div
                key={tripId}
                className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition-all duration-200 group"
              >
                <div>
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                      {t.travelStyle || 'Vacation'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {t.days} Days
                    </span>
                  </div>

                  {/* Destination */}
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>{t.destination}</span>
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {t.summary || 'Detailed day-wise travel schedule generated with AI.'}
                  </p>

                  {/* Metadata Chips */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <div className="flex items-center space-x-1 text-slate-800 dark:text-slate-200">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span>
                        {t.currency || 'INR'} {(t.budget || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.travelers || 1} Person(s)</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDelete(tripId)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Saved Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadPDF(t)}
                      disabled={downloadingId === tripId}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Download PDF"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleView(t)}
                      className="px-3.5 py-2 rounded-xl gradient-bg font-semibold text-xs shadow-sm flex items-center space-x-1.5"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
