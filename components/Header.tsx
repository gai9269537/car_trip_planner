import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onSettingsClick: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onSettingsClick, onLogoClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={onLogoClick}
            className="flex items-center space-x-2 text-xl font-bold text-brand-blue hover:text-brand-purple transition-colors"
          >
            <span>🗺️</span>
            <span>Car Trip Planner</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.profilePictureUrl && (
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={onSettingsClick}
              className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

