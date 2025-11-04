import React, { createContext, useState, useContext as useReactContext, ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { apiService } from '../services/api';

interface UserContextType {
  user: User | null;
  login: (name: string, email: string, profilePictureUrl?: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      apiService.getUser(savedUserId)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('userId');
        });
    }
  }, []);

  const login = async (name: string, email: string, profilePictureUrl?: string) => {
    try {
      const userData = await apiService.login(name, email, profilePictureUrl);
      setUser(userData);
      localStorage.setItem('userId', userData.id);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useReactContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// Export default useContext hook for convenience
export { useUserContext as useContext };

export { UserContext };

