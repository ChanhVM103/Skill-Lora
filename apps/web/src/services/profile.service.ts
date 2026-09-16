import { apiClient } from './api-client';
import type { User, UpdateProfilePayload } from '../types/auth.types';

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const profileService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/profile');
    const existing = localStorage.getItem('user');
    const merged = existing ? { ...JSON.parse(existing), ...response.data } : response.data;
    localStorage.setItem('user', JSON.stringify(merged));
    return merged;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await apiClient.put<User>('/profile', payload);
    const existing = localStorage.getItem('user');
    const merged = existing ? { ...JSON.parse(existing), ...response.data } : response.data;
    localStorage.setItem('user', JSON.stringify(merged));
    return merged;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', payload);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<{ url?: string; avatarUrl?: string }>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const avatarUrl = response.data.url || response.data.avatarUrl || '';
    const userStr = localStorage.getItem('user');
    if (userStr && avatarUrl) {
      const u = JSON.parse(userStr);
      u.avatar = avatarUrl;
      u.avatarUrl = avatarUrl;
      localStorage.setItem('user', JSON.stringify(u));
    }
    return { avatarUrl };
  },
};
