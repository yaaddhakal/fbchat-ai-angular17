// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  const token = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType')?.toLowerCase();

  if (!token) {
    // Not logged in → back to login
    router.navigate(['/']);
    return false;
  }

  // ✅ Protect sys-dashboard
  if (state.url.includes('sys-dashboard') && !(userType === 'sysuser' || userType === 'both')) {
    router.navigate(['/tenant-dashboard']);
    return false;
  }

  // ✅ Protect tenant-dashboard
  if (state.url.includes('tenant-dashboard') && userType !== 'tenantuser') {
    router.navigate(['/sys-dashboard']);
    return false;
  }

  return true;
};
