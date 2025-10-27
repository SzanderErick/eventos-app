import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export function roleGuard(rolesPermitidos: string[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    try {
      const raw = localStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : null;
      // trazas temporales
      console.log('roleGuard check:', { rolesPermitidos, user });
      if (user && rolesPermitidos.includes(user.rol)) return true;
      return router.createUrlTree(['/home']);
    } catch (e) {
      console.warn('roleGuard error leyendo user:', e);
      return router.createUrlTree(['/home']);
    }
  };
}
