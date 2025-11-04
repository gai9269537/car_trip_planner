import React from 'react';
import type { TripResult, Waypoint } from '../types';
import { GoogleMap } from '../components/GoogleMap';

interface TripResultsViewProps {
  tripResult: TripResult;
  onBack: () => void;
  onShowAttractions: (waypoint: Waypoint) => void;
  onShowWarnings: (waypoint: Waypoint) => void;
  onShowDeals: (waypoint: Waypoint) => void;
  onShowHotels: (waypoint: Waypoint) => void;
  onTripResultChange: (newTripResult: TripResult) => void;
  onSaveTrip: (tripResult: TripResult) => void;
}

export const TripResultsView: React.FC<TripResultsViewProps> = ({
  tripResult,
  onBack,
  onShowAttractions,
  onShowWarnings,
  onShowDeals,
  onShowHotels,
  onSaveTrip,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {tripResult.origin} → {tripResult.destination}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>📍 {tripResult.totalDistance}</span>
              <span>⏱️ {tripResult.totalDuration}</span>
            </div>
          </div>
          <button
            onClick={() => onSaveTrip(tripResult)}
            className="bg-brand-blue text-white px-6 py-2 rounded-md hover:bg-brand-purple transition-colors"
          >
            💾 Save Trip
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            {tripResult.steps.map((step, index) => (
              <li key={index} className="pl-2">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Map</h2>
        <GoogleMap tripResult={tripResult} height="600px" />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Waypoints</h2>
        {tripResult.waypoints.map((waypoint) => (
          <div key={waypoint.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{waypoint.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => onShowAttractions(waypoint)}
                className="bg-blue-50 text-blue-700 px-4 py-3 rounded-md hover:bg-blue-100 transition-colors text-left"
              >
                <div className="font-semibold">🏛️ Attractions</div>
                <div className="text-sm">{waypoint.attractions.length} places</div>
              </button>
              
              <button
                onClick={() => onShowWarnings(waypoint)}
                className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-md hover:bg-yellow-100 transition-colors text-left"
              >
                <div className="font-semibold">⚠️ Warnings</div>
                <div className="text-sm">{waypoint.warnings.length} alerts</div>
              </button>
              
              <button
                onClick={() => onShowDeals(waypoint)}
                className="bg-green-50 text-green-700 px-4 py-3 rounded-md hover:bg-green-100 transition-colors text-left"
              >
                <div className="font-semibold">💰 Deals</div>
                <div className="text-sm">{waypoint.deals.length} offers</div>
              </button>
              
              <button
                onClick={() => onShowHotels(waypoint)}
                className="bg-purple-50 text-purple-700 px-4 py-3 rounded-md hover:bg-purple-100 transition-colors text-left"
              >
                <div className="font-semibold">🏨 Hotels</div>
                <div className="text-sm">{waypoint.hotels.length} options</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

