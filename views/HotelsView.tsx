import React from 'react';
import type { Waypoint, Hotel, ActionLink } from '../types';

interface HotelsViewProps {
  waypoint: Waypoint;
  onBack: () => void;
  onSkillTrigger: (action: ActionLink) => void;
  onExpertHelp: (hotel: Hotel) => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({ waypoint, onBack, onSkillTrigger, onExpertHelp }) => {
  const handleAction = (action: ActionLink) => {
    if (action.type === 'skill') {
      onSkillTrigger(action);
    } else if (action.type === 'url') {
      window.open(action.target, '_blank');
    }
  };

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
          Hotels in {waypoint.name}
        </h1>
        <p className="text-gray-600 mb-8">
          Find the perfect place to stay
        </p>

        <div className="space-y-6">
          {waypoint.hotels.map((hotel) => (
            <div key={hotel.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <span>⭐</span>
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-brand-blue mb-3">
                    ${hotel.pricePerNight}
                    <span className="text-sm font-normal text-gray-600">/night</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAction(hotel.action)}
                  className="flex-1 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-purple transition-colors"
                >
                  {hotel.action.displayText}
                </button>
                {hotel.expertHelpAction && (
                  <button
                    onClick={() => onExpertHelp(hotel)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {hotel.expertHelpAction.displayText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {waypoint.hotels.length === 0 && (
          <p className="text-center text-gray-500 py-12">No hotels found for this location.</p>
        )}
      </div>
    </div>
  );
};

