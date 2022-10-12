import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { GeoserverDataComponent } from '../geoserver-data/geoserver-data.component';
import { HomeComponent } from '../home/home.component';
import { DragdropComponent } from '../dragdrop/dragdrop.component';
import { DashboardtilesComponent } from '../dashboardtiles/dashboardtiles.component';
import { ProjectHandelingComponent } from '../project-handeling/project-handeling.component';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { InputHandelingComponent } from '../input-handeling/input-handeling.component';
import { ConnectionHandelingComponent } from '../connection-handeling/connection-handeling.component';
import { AddEditConnectionComponent } from '../add-edit-connection/add-edit-connection.component';
import { ApiReviewComponent } from '../api-review/api-review.component';

const routes: Routes = [
  {
    path: '',
    // runGuardsAndResolvers: "always",
    component: HomeComponent,
    children: [
      {
        path: '',
        component: DashboardtilesComponent,
      },
      {
        path: 'project-management',
        component: ProjectHandelingComponent,
      },
      {
        path: 'create-project',
        component: CreateProjectComponent,
      },
      {
        path: 'connection-handeling',
        component: ConnectionHandelingComponent,
      },
      {
        path: 'add-edit-connection',
        component: AddEditConnectionComponent,
      },
      {
        path: 'input-handeling',
        component: InputHandelingComponent,
      },
      {
        path: 'geoData',
        component: GeoserverDataComponent,
      },
      {
        path: 'workflow/:type',
        component: DragdropComponent,
      },
      {
        path: 'api-review',
        component: ApiReviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
