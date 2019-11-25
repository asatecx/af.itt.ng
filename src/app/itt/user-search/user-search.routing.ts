import { Routes, RouterModule } from '@angular/router';
import { UserSearchComponent } from './user-search.component';

export const UserSearchRoutes: Routes = [
    {
        path: '',
        component: UserSearchComponent,
    }
];

export const UserSearchRouting = RouterModule.forChild(UserSearchRoutes);

