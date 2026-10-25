import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

import Hero from '../components/Hero';
import TripForm from '../components/TripForm';
import Loading from '../components/Loading';
import { Sparkles, MapPin, Compass, ShieldCheck, Cpu, ArrowRight, Layers, FileText } from 'lucide-react';

export default function Home({ onTripGenerated }) {
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDestination, setActiveDestination] = useState('');

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setActiveDestination(formData.destination);

    try {
      // Call backend API
      const response = await axios.post('/api/generate', formData);
      const tripData = response.data;

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success(`Itinerary for ${formData.destination} successfully created!`);
      
      if (onTripGenerated) {
        onTripGenerated(tripData);
      }

      // Navigate to Result page with trip data in state
      navigate('/result', { state: { trip: tripData } });
    } catch (error) {
      console.error('Error generating trip:', error);
      const errMsg = error.response?.data?.detail || 'Failed to generate itinerary. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Enter Travel Preferences',
      desc: 'Specify destination, budget, duration, group size, and key interest tags.',
      icon: Compass,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      step: '02',
      title: 'Few-Shot Transformer Reasoning',
      desc: 'The model utilizes in-context Few-Shot learning with travel domain dataset context.',
      icon: Cpu,
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: '03',
      title: 'Budget & Geo Enrichment',
      desc: 'Automatic budget distribution with Chart.js and GPS coordinate mapping with Leaflet.',
      icon: Layers,
      color: 'from-pink-500 to-rose-500',
    },
    {
      step: '04',
      title: 'Interactive Plan & PDF Export',
      desc: 'Explore the daily itinerary, toggle interactive map pins, and download a ReportLab PDF.',
      icon: FileText,
      color: 'from-rose-500 to-amber-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onSelectDestination={(dest) => setSelectedDestination(dest)} />

      {/* Main Content Area: Form or Loading */}
      <div className="relative py-8">
        {loading ? (
          <Loading destination={activeDestination} />
        ) : (
          <TripForm
            onSubmit={handleFormSubmit}
            initialDestination={selectedDestination}
            loading={loading}
          />
        )}
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            System Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white mt-2">
            How TripGenie AI Generates Your Trip
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base">
            Engineered using Few-Shot prompt architecture combined with curated travel datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 relative group hover:-translate-y-1.5 transition-all duration-300 shadow-md border border-slate-200/80 dark:border-slate-800"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center shadow-lg mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500">
                  PHASE {item.step}
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-1 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
