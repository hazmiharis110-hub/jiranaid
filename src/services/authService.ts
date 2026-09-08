import api from './api';
import type { User, Neighborhood } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  neighborhoodId: string;
  postcode: string;
}

export const authService = {
  async login(credentials: { email?: string; userId?: string }): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post('/auth/login', credentials);
    if (data.user) {
      localStorage.setItem('jiranaid_userId', data.user.id);
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post('/auth/register', payload);
    if (data.user) {
      localStorage.setItem('jiranaid_userId', data.user.id);
    }
    return data;
  },

  async getCurrentUser(): Promise<{ success: boolean; user: User | null }> {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post('/auth/switch-user', { userId });
    return data;
  },

  async verifyLocation(payload: { neighborhoodId: string; postcode: string; method?: string }): Promise<{ success: boolean; user: User }> {
    const { data } = await api.post('/auth/verify-location', payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('jiranaid_token');
    localStorage.removeItem('jiranaid_userId');
  },

  async getNeighborhoods(): Promise<{ success: boolean; neighborhoods: Neighborhood[] }> {
    const { data } = await api.get('/neighborhoods');
    return data;
  },
};

export default authService;
