import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard to save private path
 * Centralized logic from AuthService to valdiated the token.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // verify integrity and expired (iat, exp) from token 
  if (authService.isAuthenticated()) {
    return true;
  }

  // if token is not valid or expired, moving fordward to login
  // instead of navigation, use parseUrl
  return router.parseUrl('/login');
};