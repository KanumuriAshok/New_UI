import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { DashboardtilesComponent } from './dashboardtiles/dashboardtiles.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManageConnectionsComponent } from './manage-connections/manage-connections.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'dashboard-tiles', component: DashboardtilesComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./adminModule/admin.module')
        .then((m) => m.AdminModule)
        .catch((err) => console.log(err)),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard],
})
export class AppRoutingModule {}
