export type UserRole = string;

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
