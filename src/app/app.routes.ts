import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { SysDashboard } from './dashboard/sys-dashboard/sys-dashboard';
import { TenantDashboard } from './dashboard/tenant-dashboard/tenant-dashboard';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'sys-dashboard', component: SysDashboard, canActivate: [authGuard] },
  { path: 'tenant-dashboard', component: TenantDashboard, canActivate: [authGuard] }
];

