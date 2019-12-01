import {LayoutComponent} from './layout.component';

export const layoutRoutes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // {
      //   path: '', redirectTo: 'user', pathMatch: 'full'
      // },
      {
        path: 'user-search',
        loadChildren: '../user-search/user-search.module#UserSearchModule',
        title: 'ユーザ検索'
      },
      {
        path: '**',
      },
    ]
  }
];
