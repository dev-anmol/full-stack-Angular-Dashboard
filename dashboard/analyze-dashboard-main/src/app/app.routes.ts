import { Routes } from '@angular/router';
import { GraphComponent } from './graph/graph.component';
import { BodyComponent } from './body/body.component';

export const routes: Routes = [
    {
        path: '',
        component: BodyComponent,
        pathMatch: 'full' // Ensure this route matches only when the path is empty
    }, 
    {
        path: 'graph',
        component: GraphComponent
    },
    // Add additional routes if needed
];
