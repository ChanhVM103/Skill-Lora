import { apiClient } from './api-client';
import type { User } from '../types/auth.types';

export interface CreateAdminUserPayload {
  email: string;
  fullName: string;
  password: string;
  role?: 'student' | 'teacher' | 'admin';
}

export interface UpdateAdminUserPayload {
  fullName?: string;
  role?: 'student' | 'teacher' | 'admin';
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(payload: CreateAdminUserPayload): Promise<User> {
    const response = await apiClient.post<User>('/users', payload);
    return response.data;
  },

  async updateUser(id: string, payload: UpdateAdminUserPayload): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, payload);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/users/${id}`);
    return response.data;
  },
};
