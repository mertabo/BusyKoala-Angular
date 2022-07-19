import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { WorkspacesRoutingModule } from './workspaces-routing.module';

import { AddWorkspaceModalComponent } from './add-workspace-modal/add-workspace-modal.component';
import { AttendeesMonthComponent } from './attendees-month/attendees-month.component';
import { AttendeesTodayComponent } from './attendees-today/attendees-today.component';
import { OtherWorkspaceComponent } from './other-workspace/other-workspace.component';
import { OwnWorkspaceComponent } from './own-workspace/own-workspace.component';
import { TimeInOutComponent } from './time-in-out/time-in-out.component';
import { WorkspacesComponent } from './workspaces/workspaces.component';
import { WorkspacesListComponent } from './workspaces-list/workspaces-list.component';

@NgModule({
  declarations: [
    AddWorkspaceModalComponent,
    AttendeesMonthComponent,
    AttendeesTodayComponent,
    OtherWorkspaceComponent,
    OwnWorkspaceComponent,
    TimeInOutComponent,
    WorkspacesComponent,
    WorkspacesListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkspacesRoutingModule,
    NzDatePickerModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
  ],
})
export class WorkspacesModule {}
