import React, { useState } from 'react';
import type { TripResult } from '../types';
import { generateMockTripResult } from '../constants';

interface NewTripPlanningViewProps {
  onTripGenerated: (trip: TripResult) => void;
  onBack: () => void;
}

export const NewTripPlanningView: React.FC<NewTripPlanningViewProps> = ({ onTripGenerated, onBack }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vacationWants, setVacationWants] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      alert('Please fill in both origin and destination');
      return;
    }

    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const tripResult = generateMockTripResult(origin, destination, vacationWants);
      onTripGenerated(tripResult);
      setIsLoading(false);
    }, 1000);
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Plan Your Trip</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
              Starting Point
            </label>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="e.g., Los Angeles, CA"
              required
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="e.g., New York, NY"
              required
            />
          </div>

          <div>
            <label htmlFor="vacationWants" className="block text-sm font-medium text-gray-700 mb-2">
              What are you looking for? (Optional)
            </label>
            <textarea
              id="vacationWants"
              value={vacationWants}
              onChange={(e) => setVacationWants(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="e.g., Beach activities, hiking trails, family-friendly attractions..."
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue text-white py-3 px-4 rounded-md hover:bg-brand-purple transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Planning your trip...' : 'Generate Trip Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

