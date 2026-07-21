import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { SysDashboard } from './dashboard/sys-dashboard/sys-dashboard';
import { TenantDashboard } from './dashboard/tenant-dashboard/tenant-dashboard';
import {Homepage} from "./homepage/homepage";
import { authGuard } from './auth/auth.guard';
import{TenantSignupModal} from './modals/tenant-signup-modal/tenant-signup-modal';
export const routes: Routes = [
  
  { path: '', component: Homepage },
  {path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'sys-dashboard', component: SysDashboard, canActivate: [authGuard] },
  { path: 'tenant-dashboard', component: TenantDashboard, canActivate: [authGuard] },
 {path:'Spinner', component: TenantSignupModal}

];

