import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Result from './pages/Result';
import SavedTrips from './pages/SavedTrips';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  const [currentTrip, setCurrentTrip] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<Home onTripGenerated={(trip) => setCurrentTrip(trip)} />}
          />
          <Route path="/result" element={<Result />} />
          <Route path="/saved" element={<SavedTrips />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
