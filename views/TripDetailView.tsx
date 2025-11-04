import React from 'react';
import type { Trip } from '../types';

interface TripDetailViewProps {
  trip: Trip;
  onBack: () => void;
}

export const TripDetailView: React.FC<TripDetailViewProps> = ({ trip, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-4xl">
            {trip.iconName === 'map' ? '🗺️' : trip.iconName === 'fork-knife' ? '🍴' : '📍'}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
            <p className="text-gray-600">{trip.dates}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Planning Progress</span>
            <span className="text-sm text-gray-600">{Math.round(trip.plannedProgress * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-brand-blue h-4 rounded-full transition-all"
              style={{ width: `${trip.plannedProgress * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Status:</strong> {trip.plannedProgress === 1.0 ? 'Fully Planned' : 'In Progress'}</p>
              <p><strong>Dates:</strong> {trip.dates}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Next Steps</h2>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              <li>Review your itinerary</li>
              <li>Book accommodations</li>
              <li>Check for deals and discounts</li>
              <li>Review travel warnings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

