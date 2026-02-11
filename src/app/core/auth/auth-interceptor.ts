import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 1. Clonamos la petición para agregar el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Procesamos la petición y manejamos errores globales
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // REQUISITO: Si recibimos un 401 (Unauthorized), forzamos el cierre de sesión
      if (error.status === 401) {
        authService.logout();
      }
      
      // Propagamos el error para que el componente (como el Dashboard) pueda mostrar un mensaje si quiere
      return throwError(() => error);
    })
  );
};