import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent 
  },
  {
    path: 'dashboard', canActivate: [authGuard], 
    // Lazy Loading using dinamic import
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    // in case the rute doesn't exist 
    path: '**',
    redirectTo: 'dashboard'
  }
];