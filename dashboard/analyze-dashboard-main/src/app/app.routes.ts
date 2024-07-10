import { Routes } from '@angular/router';
import { GraphComponent } from './graph/graph.component';
import { BodyComponent } from './body/body.component';
import { AlertComponent } from './alert/alert.component';

export const routes: Routes = [
    {
        path: '',
        component: BodyComponent,
        pathMatch: 'full' // Ensure this route matches only when the path is empty
    },
    {
        path: 'graph',
        component: GraphComponent
    }, {
        path: 'alert',
        component: AlertComponent
    }
    // Add additional routes if needed
];
