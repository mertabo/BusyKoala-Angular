import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './public/home/home.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'workspaces',
    loadChildren: () =>
      import('./main/workspaces/workspaces.module').then(
        (m) => m.WorkspacesModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./public/calendar/calendar.module').then((m) => m.CalendarModule),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
