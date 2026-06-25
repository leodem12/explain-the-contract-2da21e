import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard],
  },
  {
    path: '',
    loadComponent: () => import('./shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'contracts',
        loadComponent: () => import('./contracts/contracts.component').then(m => m.ContractsComponent),
      },
      {
        path: 'upload',
        loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent),
      },
      {
        path: 'contracts/:id',
        loadComponent: () => import('./analysis/analysis-view.component').then(m => m.AnalysisViewComponent),
      },
      {
        path: 'contracts/:id/compare',
        loadComponent: () => import('./compare/compare.component').then(m => m.CompareComponent),
      },
      { path: '', redirectTo: 'contracts', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
