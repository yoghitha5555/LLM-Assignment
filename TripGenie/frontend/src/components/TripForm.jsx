import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Compass,
  Shuffle,
  Check,
  AlertCircle
} from 'lucide-react';

const INTEREST_OPTIONS = [
  { id: 'Beach', label: 'Beach', icon: '🏖️' },
  { id: 'Adventure', label: 'Adventure', icon: '🧗' },
  { id: 'Nature', label: 'Nature', icon: '🌲' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'Food', label: 'Food & Culinary', icon: '🍜' },
  { id: 'Historical', label: 'Historical', icon: '🏛️' },
  { id: 'Nightlife', label: 'Nightlife', icon: '🍸' },
  { id: 'Luxury', label: 'Luxury & Spa', icon: '💎' },
  { id: 'Culture', label: 'Culture & Arts', icon: '🎨' },
];

const TRAVEL_STYLES = [
  { id: 'Solo', label: 'Solo', desc: 'Independent exploration' },
  { id: 'Couple', label: 'Couple', desc: 'Romantic & scenic' },
  { id: 'Family', label: 'Family', desc: 'Kid-friendly & relaxed' },
  { id: 'Friends', label: 'Friends', desc: 'Excitement & nightlife' },
  { id: 'Business', label: 'Business', desc: 'Efficient & central' },
];

const PRESETS = [
  {
    destination: 'Goa',
    budget: 30000,
    currency: 'INR',
    days: 3,
    travelStyle: 'Friends',
    travelers: 3,
    interests: ['Beach', 'Nightlife', 'Food'],
  },
  {
    destination: 'Ooty',
    budget: 15000,
    currency: 'INR',
    days: 2,
    travelStyle: 'Couple',
    travelers: 2,
    interests: ['Nature', 'Food'],
  },
  {
    destination: 'Paris',
    budget: 250000,
    currency: 'INR',
    days: 5,
    travelStyle: 'Couple',
    travelers: 2,
    interests: ['Historical', 'Culture', 'Food', 'Luxury'],
  },
  {
    destination: 'Manali',
    budget: 35000,
    currency: 'INR',
    days: 4,
    travelStyle: 'Friends',
    travelers: 4,
    interests: ['Adventure', 'Nature'],
  },
  {
    destination: 'Tokyo',
    budget: 220000,
    currency: 'INR',
    days: 5,
    travelStyle: 'Solo',
    travelers: 1,
    interests: ['Culture', 'Food', 'Shopping', 'Adventure'],
  },
];

export default function TripForm({ onSubmit, initialDestination, loading }) {
  const [destination, setDestination] = useState(initialDestination || '');
  const [budget, setBudget] = useState(30000);
  const [currency, setCurrency] = useState('INR');
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Friends');
  const [travelers, setTravelers] = useState(2);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [interests, setInterests] = useState(['Beach', 'Food', 'Adventure']);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const toggleInterest = (interestId) => {
    if (interests.includes(interestId)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== interestId));
      }
    } else {
      setInterests([...interests, interestId]);
    }
  };

  const handleSurpriseMe = () => {
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setDestination(randomPreset.destination);
    setBudget(randomPreset.budget);
    setCurrency(randomPreset.currency);
    setDays(randomPreset.days);
    setTravelStyle(randomPreset.travelStyle);
    setTravelers(randomPreset.travelers);
    setInterests(randomPreset.interests);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!destination.trim()) {
      newErrors.destination = 'Please specify a travel destination';
    } else if (destination.trim().length < 2) {
      newErrors.destination = 'Destination name is too short';
    }

    if (!budget || budget <= 0) {
      newErrors.budget = 'Please enter a valid budget';
    }

    if (!days || days < 1 || days > 30) {
      newErrors.days = 'Duration must be between 1 and 30 days';
    }

    if (!travelers || travelers < 1) {
      newErrors.travelers = 'Must have at least 1 traveler';
    }

    if (interests.length === 0) {
      newErrors.interests = 'Please select at least 1 interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        destination: destination.trim(),
        budget: Number(budget),
        currency,
        days: Number(days),
        travelStyle,
        travelers: Number(travelers),
        interests,
        startDate,
      });
    }
  };

  return (
    <div id="planner" className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-2xl relative border border-slate-200/80 dark:border-slate-800">
        
        {/* Header and Surprise Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <span>✈ Trip Planner Form</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure parameters for the Few-Shot LLM generation engine
            </p>
          </div>
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Surprise Me (Auto-fill)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Row 1: Destination & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Destination */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Destination <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input
                  type="text"
                  placeholder="e.g. Goa, Paris, Ooty, Tokyo, Bali..."
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (errors.destination) setErrors({ ...errors, destination: null });
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border ${
                    errors.destination
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all`}
                />
              </div>
              {errors.destination && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.destination}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Budget & Currency & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Budget */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Total Budget <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-24 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm font-semibold focus:outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    placeholder="e.g. 30000"
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      if (errors.budget) setErrors({ ...errors, budget: null });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border ${
                      errors.budget
                        ? 'border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium`}
                  />
                </div>
              </div>
              {errors.budget && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.budget}
                </p>
              )}
            </div>

            {/* Number of Days */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Number of Days <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => {
                    setDays(e.target.value);
                    if (errors.days) setErrors({ ...errors, days: null });
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              {errors.days && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.days}
                </p>
              )}
            </div>

          </div>

          {/* Row 3: Travel Style & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Travel Style */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Travel Style (Dropdown & Quick Select)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {TRAVEL_STYLES.map((style) => {
                  const isSelected = travelStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setTravelStyle(style.id)}
                      className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      <span className="block font-bold">{style.label}</span>
                      <span className="text-[10px] opacity-80 hidden sm:block truncate mt-0.5">{style.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travelers Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Travelers Count
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

          </div>

          {/* Row 4: Interests Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Interests & Activities (Select all that apply) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {interests.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {INTEREST_OPTIONS.map((opt) => {
                const isSelected = interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-sm">{opt.icon}</span>
                    <span className="flex-1 text-left truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {errors.interests && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.interests}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl gradient-bg font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Sparkles className="w-5 h-5 text-white animate-spin" />
              <span>{loading ? 'Crafting Itinerary with AI...' : 'Generate Day-Wise Travel Itinerary'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
