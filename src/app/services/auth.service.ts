import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'renthub_users';
  private readonly SESSION_KEY = 'renthub_current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private toastService: ToastService) {
    this.initDefaultUsers();
    this.loadSession();
  }

  private initDefaultUsers(): void {
    const existing = localStorage.getItem(this.USERS_KEY);
    if (!existing) {
      const defaultUsers: User[] = [
        {
          id: 'u-1',
          name: 'Sarah Jenkins',
          email: 'landlord@renthub.com',
          password: 'Password123!',
          role: 'landlord',
          phone: '+1 (555) 234-5678',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 'u-2',
          name: 'Alex Rivera',
          email: 'renter@renthub.com',
          password: 'Password123!',
          role: 'renter',
          phone: '+1 (555) 987-6543',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 'u-3',
          name: 'Priya Sharma',
          email: 'priya@renthub.com',
          password: 'Password123!',
          role: 'both',
          phone: '+1 (555) 456-7890',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  private loadSession(): void {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      if (sessionStr) {
        const user: User = JSON.parse(sessionStr);
        this.currentUserSubject.next(user);
      }
    } catch {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  public getUsers(): User[] {
    try {
      const raw = localStorage.getItem(this.USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public register(userData: { name: string; email: string; password: string; role?: UserRole; phone?: string }): { success: boolean; message: string } {
    const users = this.getUsers();
    const normalizedEmail = userData.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: 'u-' + Date.now(),
      name: userData.name.trim(),
      email: normalizedEmail,
      password: userData.password,
      role: userData.role || 'renter',
      phone: userData.phone || '',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name.trim())}`
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    // Automatically log user in upon registration
    this.setCurrentSession(newUser);
    this.toastService.success(`Welcome to RentHub, ${newUser.name}!`);
    return { success: true, message: 'Registration successful!' };
  }

  public login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const matched = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);

    if (!matched) {
      return { success: false, message: 'Invalid email or password.' };
    }

    this.setCurrentSession(matched);
    this.toastService.success(`Welcome back, ${matched.name}!`);
    return { success: true, message: 'Login successful!' };
  }

  public logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.currentUserSubject.next(null);
    this.toastService.info('You have logged out.');
  }

  private setCurrentSession(user: User): void {
    // Strip password from session store
    const safeUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(safeUser));
    this.currentUserSubject.next(safeUser);
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}

