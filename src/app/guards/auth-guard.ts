import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');
  console.log('authGuard check user exists:', !!user);
  return user ? true : router.createUrlTree(['/login']);
};
