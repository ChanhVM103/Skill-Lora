export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin' | string;
  avatar?: string;
  avatarUrl?: string;
  bio?: string;
  targetRole?: string;
  school?: string;
  major?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role?: 'student' | 'teacher';
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  school?: string;
  major?: string;
  targetRole?: string;
  address?: string;
}
