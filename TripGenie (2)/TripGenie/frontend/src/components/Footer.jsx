import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, GraduationCap, Globe, Code2 } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const techStack = [
    'React + Vite',
    'Tailwind CSS',
    'FastAPI (Python)',
    'OpenAI GPT-4o',
    'Few-Shot Prompting',
    'MongoDB + Motor',
    'ReportLab PDF',
    'Leaflet Maps',
    'Chart.js',
    'Pandas Datasets',
  ];

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Assignment Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <span className="text-xl font-black font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                TripGenie
              </span>
            </Link>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              An AI-powered travel itinerary generator engineered with Few-Shot Transformer Prompting,
              dataset recommendation analytics, interactive GPS mapping, and automated PDF exports.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>University Assignment: Text Generation using Transformer Models</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore Pages
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Home & Hero
                </Link>
              </li>
              <li>
                <Link to="/#planner" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Trip Planner Form
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Saved Itineraries
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  Few-Shot Architecture & Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Core Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {currentYear} TripGenie. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted for University Assignment with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" />
            <span>& Transformer Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
