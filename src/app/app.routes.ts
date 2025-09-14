import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UserRoles } from './models/user-roles.enum';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        m => m.LandingComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.USER, UserRoles.ADMIN] },
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        m => m.ProductListComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.USER, UserRoles.ADMIN] },
  },
  {
    path: 'products/add',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        m => m.ProductFormComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.ADMIN] },
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        m => m.ProductFormComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.ADMIN] },
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        m => m.ProductDetailComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.USER, UserRoles.ADMIN] },
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./components/reports/reports.component').then(
        m => m.ReportsComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.ADMIN] },
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/user-info/user-info.component').then(
        m => m.UserInfoComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.USER, UserRoles.ADMIN] },
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        m => m.SettingsComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [UserRoles.ADMIN] },
  },
  { path: '**', redirectTo: '/dashboard' },
];
