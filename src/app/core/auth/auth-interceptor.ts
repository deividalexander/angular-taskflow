import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone the request to add the toke
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // process the request and review global errors 
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // in case received a 401, force to quit the session 
      if (error.status === 401) {
        authService.logout();
      }
      
      // Propagate the error in all the application
      return throwError(() => error);
    })
  );
};