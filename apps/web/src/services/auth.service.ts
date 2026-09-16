import { apiClient } from './api-client';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '../types/auth.types';


export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/login', payload);
    const token = response.data.accessToken || response.data.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return {
      user: response.data.user,
      token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      message: response.data.message,
    };
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/register', payload);
    const token = response.data.accessToken || response.data.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return {
      user: response.data.user,
      token,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      message: response.data.message,
    };
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/profile');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await apiClient.put<User>('/profile', payload);
    localStorage.setItem('user', JSON.stringify(response.data));
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
    const current = this.getCurrentUser();
    if (current && avatarUrl) {
      current.avatar = avatarUrl;
      current.avatarUrl = avatarUrl;
      localStorage.setItem('user', JSON.stringify(current));
    }
    return { avatarUrl };
  },
};
