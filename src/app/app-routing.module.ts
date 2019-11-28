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
    loadChildren: './itt/main.module#WorkspaceModule'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user',
    loadChildren: './itt/user-search/user-search.module#UserSearchModule'
  },
  // {
  //   path: 'login',
  //   loadChildren: './itt/sample/sample.module#SampleModule'
  // }
];

// @NgModule({
//   imports: [RouterModule.forRoot(appRoutes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
