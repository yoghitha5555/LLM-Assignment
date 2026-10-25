import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="glass-card max-w-md w-full p-8 sm:p-10 rounded-3xl text-center shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />

        <div className="w-16 h-16 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-500/30">
          <Compass className="w-8 h-8 animate-spin" />
        </div>

        <h1 className="text-6xl font-black font-display gradient-text">404</h1>
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-2">
          Destination Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-8 leading-relaxed">
          Looks like this travel route hasn't been charted by TripGenie yet. Let's get you back on track!
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl gradient-bg font-bold text-xs shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to TripGenie Home</span>
        </Link>
      </div>
    </div>
  );
}
