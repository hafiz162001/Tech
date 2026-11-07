import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'talent-hub', pathMatch: 'full' },
  {
    path: 'talent-hub',
    loadComponent: () => import('./pages/talent-hub/talent-hub.component').then(m => m.TalentHubComponent)
  },
  {
    path: 'talent-map',
    loadComponent: () => import('./pages/talent-map/talent-map.component').then(m => m.TalentMapComponent)
  },
  {
    path: 'placements',
    loadComponent: () => import('./pages/placements/placements.component').then(m => m.PlacementsComponent)
  },
  {
    path: 'timesheets',
    loadComponent: () => import('./pages/timesheets/timesheets.component').then(m => m.TimesheetsComponent)
  },
  {
    path: 'payroll',
    loadComponent: () => import('./pages/payroll/payroll.component').then(m => m.PayrollComponent)
  },
  { path: '**', redirectTo: 'talent-hub' }
];
