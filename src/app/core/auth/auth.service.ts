import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface UserClaims {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  // Simulate success response with any credential
  login(email: string, password: string): Observable<string> {
    const mockToken = this.generateMockJwt(email);
    
    return of(mockToken).pipe(
      delay(500),
      tap(token => {
        localStorage.setItem('token', token);
        localStorage.setItem('login_time', Date.now().toString());
      })
    );
  }

  /**
   * Decode the claims of JWT
   */
  getUserClaims(): UserClaims | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode the payload from JWT second part of the string
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload)) as UserClaims;
    } catch (e) {
      return null;
    }
  }

  /**
   * Integrity validation and expired token
   */
isAuthenticated(): boolean {
    const token = this.getToken();
    const loginTime = localStorage.getItem('login_time');

    if (!token || !loginTime) return false;

    // const to manage the session
    const expirationTime = 60 * 1000; 
    const isExpiredLocal = Date.now() - Number(loginTime) > expirationTime;
    
    // complementary validation by claims of JWT
    const claims = this.getUserClaims();
    const isExpiredJWT = claims ? (Date.now() / 1000) > claims.exp : true;

    if (isExpiredLocal || isExpiredJWT) {
      this.logout();
      return false;
    }

    return true;
  }

  logout(): void {
    localStorage.clear(); // total clean for security
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Generate mock JWT for testing
   */
  private generateMockJwt(email: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: '1234567890',
      name: email.split('@')[0],
      email: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // Expired in 1 hour
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  }
}