import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { CalendarModule } from '../calendar/calendar.module';

import { AttendeesMonthComponent } from './attendees-month/attendees-month.component';
import { AttendeesTodayComponent } from './attendees-today/attendees-today.component';
import { OtherWorkspaceComponent } from './other-workspace/other-workspace.component';
import { OwnWorkspaceComponent } from './own-workspace/own-workspace.component';
import { TimeInOutComponent } from './time-in-out/time-in-out.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { WorkspacesListComponent } from './workspaces-list/workspaces-list.component';

@NgModule({
  declarations: [
    AttendeesMonthComponent,
    AttendeesTodayComponent,
    OtherWorkspaceComponent,
    OwnWorkspaceComponent,
    TimeInOutComponent,
    WorkspacesComponent,
    WorkspacesListComponent,
  ],
  imports: [CommonModule, WorkspacesRoutingModule, CalendarModule],
})
export class WorkspacesModule {}
