import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


export const appRoutes = [
  {
    path: '',
    loadChildren: './itt/user-search/user-search.module#UserSearchModule'
  },
  {
    path: 'login',
    loadChildren: './itt/sample/sample.module#SampleModule'
  }
];

// @NgModule({
//   imports: [RouterModule.forRoot(appRoutes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
