import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login/login').then(m => m.LoginComponent),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./core/home/home').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },

  // Salones
  {
    path: 'salones',
    loadComponent: () =>
      import('./core/salones/salones').then(m => m.SalonesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'salones/nuevo',
    loadComponent: () =>
      import('./core/salones/form-salon/form-salon').then(m => m.FormSalonComponent),
    canActivate: [authGuard],
  },
  {
    path: 'salones/:id',
    loadComponent: () =>
      import('./core/salones/form-salon/form-salon').then(m => m.FormSalonComponent),
    canActivate: [authGuard],
  },

  // Mesas y Sillas
  {
    path: 'mesas-sillas',
    loadComponent: () =>
      import('./core/mesas-sillas/mesas-sillas').then(m => m.MesasSillasComponent),
    canActivate: [authGuard],
  },
  {
    path: 'mesas-sillas/nueva',
    loadComponent: () =>
      import('./core/mesas-sillas/form-mesa-silla/form-mesa-silla').then(m => m.FormMesaSillaComponent),
    canActivate: [authGuard],
  },
  {
    path: 'mesas-sillas/:id',
    loadComponent: () =>
      import('./core/mesas-sillas/form-mesa-silla/form-mesa-silla').then(m => m.FormMesaSillaComponent),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: 'home' },
];
