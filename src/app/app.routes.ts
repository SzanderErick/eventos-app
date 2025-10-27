import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

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

  // Salones (solo agente)
  {
    path: 'salones',
    loadComponent: () =>
      import('./core/salones/salones').then(m => m.SalonesComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'salones/nuevo',
    loadComponent: () =>
      import('./core/salones/form-salon/form-salon').then(m => m.FormSalonComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'salones/:id',
    loadComponent: () =>
      import('./core/salones/form-salon/form-salon').then(m => m.FormSalonComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },

  // Mesas y Sillas (solo agente)
  {
    path: 'mesas-sillas',
    loadComponent: () =>
      import('./core/mesas-sillas/mesas-sillas').then(m => m.MesasSillasComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'mesas-sillas/nueva',
    loadComponent: () =>
      import('./core/mesas-sillas/form-mesa-silla/form-mesa-silla').then(m => m.FormMesaSillaComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'mesas-sillas/:id',
    loadComponent: () =>
      import('./core/mesas-sillas/form-mesa-silla/form-mesa-silla').then(m => m.FormMesaSillaComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },

  // Mantelería (solo agente)
  {
    path: 'manteleria',
    loadComponent: () =>
      import('./core/manteleria/manteleria').then(m => m.ManteleriaComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'manteleria/nuevo',
    loadComponent: () =>
      import('./core/manteleria/form-mantel/form-mantel').then(m => m.FormMantelComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'manteleria/:id',
    loadComponent: () =>
      import('./core/manteleria/form-mantel/form-mantel').then(m => m.FormMantelComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'manteleria/asignar',
    loadComponent: () =>
      import('./core/manteleria/asignar-mantel/asignar-mantel').then(m => m.AsignarMantelComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },

  // Eventos (ambos); crear/editar solo agente
  {
    path: 'eventos',
    loadComponent: () =>
      import('./core/eventos/eventos').then(m => m.EventosComponent),
    canActivate: [authGuard],
  },
  {
    path: 'eventos/nuevo',
    loadComponent: () =>
      import('./core/eventos/form-evento/form-evento').then(m => m.FormEventoComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  {
    path: 'eventos/:id',
    loadComponent: () =>
      import('./core/eventos/form-evento/form-evento').then(m => m.FormEventoComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },

  // Boletos admin (solo agente)
  {
    path: 'boletos',
    loadComponent: () =>
      import('./core/boletos/boletos').then(m => m.BoletosComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },
  // Publicar boletos (agente)
  {
    path: 'boletos/publicar',
    loadComponent: () =>
      import('./core/boletos/form-publicar-boleto/form-publicar-boleto').then(m => m.FormPublicarBoletoComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },

  // Cliente: ver boletos publicados para un evento (antes de cualquier ruta dinámica de boletos)
  {
    path: 'boletos/disponibles',
    loadComponent: () =>
      import('./core/boletos/publicados-evento/publicados-evento').then(m => m.PublicadosEventoComponent),
    canActivate: [authGuard, roleGuard(['cliente'])],
  },

  {
    path: 'boletos/nuevo',
    loadComponent: () =>
      import('./core/boletos/form-boleto/form-boleto').then(m => m.FormBoletoComponent),
    canActivate: [authGuard],
  },

  // Cliente: Mis Boletos
  {
    path: 'mis-boletos',
    loadComponent: () =>
      import('./core/boletos/mis-boletos/mis-boletos').then(m => m.MisBoletosComponent),
    canActivate: [authGuard, roleGuard(['cliente'])],
  },

  // Administración de usuarios (solo agente)
  {
    path: 'usuarios/nuevo',
    loadComponent: () =>
      import('./core/usuarios/ form-usuario').then(m => m.FormUsuarioComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },

  {
    path: 'boletos/:id',
    loadComponent: () =>
      import('./core/boletos/form-boleto/form-boleto').then(m => m.FormBoletoComponent),
    canActivate: [authGuard, roleGuard(['agente'])],
  },

  { path: '**', redirectTo: 'home' },
];
