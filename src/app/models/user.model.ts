export type UserRole = 'renter' | 'landlord' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

