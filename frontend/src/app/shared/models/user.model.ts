export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'General User' | 'Admin';
  department: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
  delayMs?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}
