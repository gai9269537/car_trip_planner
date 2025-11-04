import React from 'react';
import type { Trip } from '../types';

interface HomeViewProps {
  onNewTripClick: () => void;
  onTripClick: (trip: Trip) => void;
  upcomingTrips: Trip[];
  loading?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNewTripClick, onTripClick, upcomingTrips, loading = false }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Plan Your Perfect Road Trip
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing destinations, find the best hotels, and create unforgettable memories
        </p>
        <button
          onClick={onNewTripClick}
          className="bg-brand-blue text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-brand-purple transition-colors shadow-lg"
        >
          🚗 Plan New Trip
        </button>
      </div>

      {loading ? (
        <div className="mt-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-2"></div>
          <p className="text-gray-600">Loading trips...</p>
        </div>
      ) : upcomingTrips.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onTripClick(trip)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{trip.iconName === 'map' ? '🗺️' : trip.iconName === 'fork-knife' ? '🍴' : '📍'}</span>
                  <span className="text-sm text-gray-500">{trip.dates}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{trip.name}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-brand-blue h-2 rounded-full transition-all"
                    style={{ width: `${trip.plannedProgress * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {Math.round(trip.plannedProgress * 100)}% planned
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-500">
          <p>No trips yet. Create your first trip to get started!</p>
        </div>
      )}
    </div>
  );
};

