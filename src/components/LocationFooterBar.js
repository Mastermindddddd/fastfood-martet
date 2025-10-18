"use client";
import { useContext, useEffect } from 'react';
import { CartContext } from '@/components/AppContext';

export default function LocationFooterBar() {
  const { userLocation, locationLoading, locationError, requestLocation } = useContext(CartContext);

  // Auto-request location on component mount
  useEffect(() => {
    if (!userLocation && !locationError) {
      requestLocation();
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {locationLoading ? (
          // Loading State
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xl">📍</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm">Detecting your location...</span>
              <span className="text-slate-400 text-xs">Please allow location access in your browser</span>
            </div>
            <div className="ml-auto">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        ) : locationError ? (
          // Error State
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">Location Access Denied</span>
                <span className="text-slate-400 text-xs">{locationError}</span>
              </div>
            </div>
            <button
              onClick={requestLocation}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Try Again
            </button>
          </div>
        ) : userLocation ? (
          // Success State
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center relative">
                <span className="text-xl">📍</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">Location Active</span>
                <span className="text-slate-400 text-xs">
                  Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                  {userLocation.accuracy && ` • Accuracy: ${Math.round(userLocation.accuracy)}m`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Live</span>
              </div>
              <button
                onClick={requestLocation}
                className="text-slate-400 hover:text-white text-xs underline transition-colors"
                title="Refresh location"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}