import { Routes, RouterModule } from '@angular/router';
import { SampleComponent } from './sample.component';

export const sampleRoutes: Routes = [
    {
        path: '',
        component: SampleComponent,
        // children: [
        //     {
        //       path: 'dashboard',
        //       loadChildren: '../dashboard/dashboard.module#DashboardModule'
        //     },
        //     {
        //       path: 'visualization',
        //       loadChildren: '../visualization/visualization.module#VisualizationModule'
        //     }
        // ]
    }
];

export const SampleRouting = RouterModule.forChild(sampleRoutes);

