import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, MapPin, DollarSign, Calendar, Cpu } from 'lucide-react';

const LOADING_STEPS = [
  { text: 'Analyzing destination data & tourist preferences...', icon: Compass },
  { text: 'Formulating Few-Shot prompts for Transformer Model...', icon: Cpu },
  { text: 'Structuring day-wise morning, afternoon & evening plans...', icon: Calendar },
  { text: 'Calculating realistic budget distributions & cost savings...', icon: DollarSign },
  { text: 'Extracting GPS geo-coordinates for Leaflet Map...', icon: MapPin },
  { text: 'Polishing your complete personalized itinerary...', icon: Sparkles },
];

export default function Loading({ destination }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 92 ? prev + Math.floor(Math.random() * 8) + 3 : prev));
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const StepIcon = LOADING_STEPS[currentStep].icon;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-lg w-full p-8 sm:p-10 rounded-2xl shadow-2xl border border-indigo-100 dark:border-indigo-950/60 text-center relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Central Rotating Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <StepIcon className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        {/* Destination & Headline */}
        <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Generating {destination ? `${destination} Itinerary` : 'Your Travel Plan'}
        </h3>
        
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mt-1">
          OpenAI Transformer • Few-Shot Prompt Pipeline
        </p>

        {/* Dynamic Step Text */}
        <div className="my-6 min-h-[48px] flex items-center justify-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-fade-in transition-all">
            {LOADING_STEPS[currentStep].text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          <div
            className="h-full gradient-bg transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="mt-3 flex justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          <span>AI Reasoning & Retrieval</span>
          <span>{progress}%</span>
        </div>

      </div>
    </div>
  );
}
