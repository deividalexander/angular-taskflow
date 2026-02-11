import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideRouter([])
      ]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Use fakeAsync to simulate the time 
  it('should expire session and logout after 60 seconds', fakeAsync(async () => {
    // 1. Start the session
    service.login('test@test.com', '123456').subscribe();
    
    // kind of a delay in mock
    tick(500); 
    
    // 2. Verify the session is valid
    expect(service.isAuthenticated()).toBe(true);

    tick(61000);

    // 4. should be expired and clean the storage
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  }));

  it('should decode user claims correctly', fakeAsync(() => {
    service.login('admin@taskflow.com', '123456').subscribe();
    tick(500);

    const claims = service.getUserClaims();
    expect(claims).not.toBeNull();
    expect(claims?.email).toBe('admin@taskflow.com');
  }));
});