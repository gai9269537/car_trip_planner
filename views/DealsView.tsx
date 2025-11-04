import React from 'react';
import type { Deal, ActionLink } from '../types';

interface DealsViewProps {
  deals: Deal[];
  contextName: string;
  onBack: () => void;
  onSkillTrigger: (action: ActionLink) => void;
}

export const DealsView: React.FC<DealsViewProps> = ({ deals, contextName, onBack, onSkillTrigger }) => {
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
          Deals & Offers
        </h1>
        <p className="text-gray-600 mb-8">
          Special offers for {contextName}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="mb-3">
                <span className="text-sm text-gray-500">{deal.provider}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{deal.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{deal.description}</p>
              <button
                onClick={() => handleAction(deal.action)}
                className="w-full bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-purple transition-colors"
              >
                {deal.action.displayText}
              </button>
            </div>
          ))}
        </div>

        {deals.length === 0 && (
          <p className="text-center text-gray-500 py-12">No deals available for this location.</p>
        )}
      </div>
    </div>
  );
};

