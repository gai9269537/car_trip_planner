const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(name: string, email: string, profilePictureUrl?: string) {
    return this.request<{ id: string; name: string; email: string; profilePictureUrl?: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, profilePictureUrl }),
      }
    );
  }

  async getUser(userId: string) {
    return this.request<{ id: string; name: string; email: string; profilePictureUrl?: string }>(
      `/auth/user/${userId}`
    );
  }

  // Trip endpoints
  async getTrips(userId: string) {
    return this.request<Array<{ id: string; name: string; dates: string; plannedProgress: number; iconName: string }>>(
      `/trips?userId=${userId}`
    );
  }

  async getTrip(tripId: string) {
    return this.request<{
      id: string;
      origin: string;
      destination: string;
      totalDistance: string;
      totalDuration: string;
      waypoints: any[];
      steps: string[];
    }>(`/trips/${tripId}`);
  }

  async generateTrip(userId: string, origin: string, destination: string, vacationWants?: string) {
    return this.request<{
      id: string;
      origin: string;
      destination: string;
      totalDistance: string;
      totalDuration: string;
      waypoints: any[];
      steps: string[];
    }>('/trips/generate', {
      method: 'POST',
      body: JSON.stringify({ userId, origin, destination, vacationWants }),
    });
  }

  async saveTrip(userId: string, tripResult: any) {
    return this.request('/trips/save', {
      method: 'POST',
      body: JSON.stringify({ userId, tripResult }),
    });
  }

  async deleteTrip(tripId: string) {
    return this.request(`/trips/${tripId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

