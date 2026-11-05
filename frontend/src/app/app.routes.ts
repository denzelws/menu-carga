import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/consulta/consulta').then((m) => m.Consulta),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/cadastro/cadastro').then((m) => m.Cadastro),
  },
  {
    path: 'cargas',
    loadComponent: () => import('./features/cargas/cargas').then((m) => m.Importacao),
  },
  { path: '**', redirectTo: '' },
];
