import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Maximize2, Minimize2, Star, Hotel, Compass } from 'lucide-react';

export default function MapView({ destination, mapPoints = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Determine initial center
    let centerLat = 20.5937;
    let centerLng = 78.9629;
    let initialZoom = 12;

    if (mapPoints.length > 0 && mapPoints[0].lat && mapPoints[0].lng) {
      centerLat = mapPoints[0].lat;
      centerLng = mapPoints[0].lng;
    }

    // Clean previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Custom OpenStreetMap / Carto Tile Layer (Clean modern styling)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Markers layer group
    const markers = [];

    mapPoints.forEach((pt, index) => {
      if (!pt.lat || !pt.lng) return;

      const isHotel = pt.category?.toLowerCase().includes('hotel') || pt.name?.toLowerCase().includes('hotel');
      const isDestinationCenter = index === 0;

      // Custom HTML Pin Marker
      const iconHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-8 h-8 rounded-full ${
            isHotel
              ? 'bg-purple-600'
              : isDestinationCenter
              ? 'bg-indigo-600'
              : 'bg-emerald-600'
          } text-white flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-2 border-white hover:scale-125 transition-transform duration-200">
            <span class="text-xs font-bold">${index + 1}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div class="p-3 max-w-xs text-left">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isHotel ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
            }">
              ${pt.category || 'Sightseeing'}
            </span>
            <span class="text-xs font-bold text-amber-500 flex items-center">
              ★ ${pt.rating || 4.8}
            </span>
          </div>
          <h4 class="font-bold text-sm text-slate-900">${pt.name}</h4>
          <p class="text-xs text-slate-600 mt-1 leading-snug">${pt.description || ''}</p>
          ${
            pt.entryFee
              ? `<p class="text-[11px] font-semibold text-slate-700 mt-1.5">🎟 Entry: ₹${pt.entryFee}</p>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => setSelectedPoint(pt));
      markers.push(marker);
    });

    // Auto-fit bounds if multiple points exist
    if (markers.length > 1) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapPoints, destination]);

  const fitAllPoints = () => {
    if (mapInstanceRef.current && mapPoints.length > 0) {
      const validPoints = mapPoints.filter((p) => p.lat && p.lng);
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map((p) => [p.lat, p.lng]));
        mapInstanceRef.current.fitBounds(bounds.pad(0.2));
      }
    }
  };

  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 overflow-hidden' : ''}`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive {destination} Map</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key points of interest, attraction pins, and hotel coordinates
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fitAllPoints}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title="Reset Map Bounds"
          >
            <Navigation className="w-3.5 h-3.5 text-indigo-500" />
            <span>Center</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand Map'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Element */}
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner" style={{ height: isExpanded ? 'calc(100% - 110px)' : '380px' }}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md text-[11px] font-medium text-slate-700 dark:text-slate-300 space-y-1.5 pointer-events-auto">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Primary Landmark</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Attractions & Sights</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>Recommended Hotel</span>
          </div>
        </div>
      </div>

      {/* Selected Location Pill Carousel */}
      {mapPoints.length > 0 && (
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {mapPoints.map((pt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPoint(pt);
                if (mapInstanceRef.current && pt.lat && pt.lng) {
                  mapInstanceRef.current.flyTo([pt.lat, pt.lng], 14, { duration: 1.2 });
                }
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 transition-colors"
            >
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <span>{pt.name}</span>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
