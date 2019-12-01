import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './itt/login/login.component';

export const appRoutes = [
  // {
  //   path: 'main',
  //   loadChildren: () => import('./itt/main.module')
  //     .then(m => m.PagesModule),
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: './itt/layout/layout.module#LayoutModule'
  },
  {
    path: 'login',
    component: LoginComponent
  },
];

// @NgModule({
//   imports: [RouterModule.forRoot(appRoutes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
