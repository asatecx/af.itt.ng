import {WorkspaceComponent} from './layout.component';

export const workspaceRoutes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      // {
      //   path: '', redirectTo: 'user', pathMatch: 'full'
      // },
      {
        path: 'user-search',
        loadChildren: '../../itt/user-search/user-search.module#UserSearchModule',
        title: 'ユーザ検索'
      },
      {
        path: '**',
      },
    ]
  }
];
