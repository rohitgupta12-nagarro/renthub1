import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService, ToastService]
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created and initialize default test accounts', () => {
    expect(service).toBeTruthy();
    const users = service.getUsers();
    expect(users.length).toBeGreaterThanOrEqual(2);
    expect(users.some(u => u.email === 'landlord@renthub.com')).toBe(true);
  });

  it('should authenticate user with valid credentials', () => {
    const res = service.login('landlord@renthub.com', 'Password123!');
    expect(res.success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getCurrentUser()?.email).toBe('landlord@renthub.com');
  });

  it('should reject invalid credentials', () => {
    const res = service.login('landlord@renthub.com', 'WrongPassword');
    expect(res.success).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should register a new user and log them in', () => {
    const res = service.register({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      role: 'renter',
      phone: '+1 (555) 123-4567'
    });

    expect(res.success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getCurrentUser()?.name).toBe('John Doe');
  });

  it('should prevent registration with duplicate email', () => {
    const res = service.register({
      name: 'Duplicate',
      email: 'landlord@renthub.com',
      password: 'Password123!'
    });

    expect(res.success).toBe(false);
  });

  it('should log out user and clear current session', () => {
    service.login('landlord@renthub.com', 'Password123!');
    expect(service.isAuthenticated()).toBe(true);

    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });
});

