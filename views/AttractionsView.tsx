import React from 'react';
import type { Waypoint, Attraction } from '../types';

interface AttractionsViewProps {
  waypoint: Waypoint;
  onBack: () => void;
  onShowDeals: (attraction: Attraction) => void;
}

export const AttractionsView: React.FC<AttractionsViewProps> = ({ waypoint, onBack, onShowDeals }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Attractions in {waypoint.name}
        </h1>
        <p className="text-gray-600 mb-8">
          Discover amazing places to visit during your trip
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {waypoint.attractions.map((attraction) => (
            <div key={attraction.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{attraction.name}</h3>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <span>⭐</span>
                  <span className="text-sm font-medium">{attraction.rating}</span>
                </div>
              </div>
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                  {attraction.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">{attraction.description}</p>
              {attraction.deals && attraction.deals.length > 0 && (
                <button
                  onClick={() => onShowDeals(attraction)}
                  className="text-brand-blue hover:text-brand-purple text-sm font-medium"
                >
                  View Deals →
                </button>
              )}
            </div>
          ))}
        </div>

        {waypoint.attractions.length === 0 && (
          <p className="text-center text-gray-500 py-12">No attractions found for this location.</p>
        )}
      </div>
    </div>
  );
};

