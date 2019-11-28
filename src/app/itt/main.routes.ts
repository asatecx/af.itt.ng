import {WorkspaceComponent} from './main.component';

export const workspaceRoutes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '', redirectTo: 'user', pathMatch: 'full'
      },
      {
        path: 'user',
        loadChildren: '../itt/user-search/user-search.module#UserSearchModule',
        title: '普通表格'
      },
      {
        path: '**',
      },
    ]
  }
];
