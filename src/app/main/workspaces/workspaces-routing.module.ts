import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { WorkspacesChildComponent } from './workspaces-child/workspaces-child.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspacesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        component: WorkspacesChildComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspacesRoutingModule {}
