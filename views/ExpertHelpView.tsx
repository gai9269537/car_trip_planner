import React from 'react';
import type { Hotel } from '../types';

interface ExpertHelpViewProps {
  hotel: Hotel;
  onBack: () => void;
}

export const ExpertHelpView: React.FC<ExpertHelpViewProps> = ({ hotel, onBack }) => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Expert Help for {hotel.name}
        </h1>
        <p className="text-gray-600 mb-8">
          Get personalized assistance from our travel experts
        </p>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              💬 Chat with an Expert
            </h2>
            <p className="text-blue-800 mb-4">
              Our travel experts are here to help you with:
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-2 mb-4">
              <li>Best room selection for your needs</li>
              <li>Special requests and accommodations</li>
              <li>Group booking assistance</li>
              <li>Local area recommendations</li>
              <li>Travel planning advice</li>
            </ul>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hotel Information</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> {hotel.name}</p>
              <p><strong>Rating:</strong> ⭐ {hotel.rating}</p>
              <p><strong>Price:</strong> ${hotel.pricePerNight}/night</p>
              <p><strong>Amenities:</strong> {hotel.amenities.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

