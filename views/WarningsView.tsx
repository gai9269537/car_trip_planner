import React from 'react';
import type { Waypoint } from '../types';
import { WarningSeverity } from '../types';

interface WarningsViewProps {
  waypoint: Waypoint;
  onBack: () => void;
}

export const WarningsView: React.FC<WarningsViewProps> = ({ waypoint, onBack }) => {
  const getSeverityColor = (severity: WarningSeverity) => {
    switch (severity) {
      case WarningSeverity.High:
        return 'bg-red-50 border-red-200 text-red-800';
      case WarningSeverity.Medium:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case WarningSeverity.Low:
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: WarningSeverity) => {
    switch (severity) {
      case WarningSeverity.High:
        return '🔴';
      case WarningSeverity.Medium:
        return '🟡';
      case WarningSeverity.Low:
        return '🔵';
      default:
        return '⚪';
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
          Warnings for {waypoint.name}
        </h1>
        <p className="text-gray-600 mb-8">
          Important information to keep in mind during your visit
        </p>

        <div className="space-y-4">
          {waypoint.warnings.map((warning) => (
            <div
              key={warning.id}
              className={`border rounded-lg p-6 ${getSeverityColor(warning.severity)}`}
            >
              <div className="flex items-start space-x-4">
                <span className="text-2xl">{getSeverityIcon(warning.severity)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{warning.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs uppercase font-medium opacity-75">
                        {warning.severity}
                      </span>
                      <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                        {warning.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">{warning.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {waypoint.warnings.length === 0 && (
          <p className="text-center text-gray-500 py-12">No warnings for this location.</p>
        )}
      </div>
    </div>
  );
};

