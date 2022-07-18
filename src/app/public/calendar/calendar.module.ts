import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import { CalendarRoutingModule } from './calendar-routing.module';

import { CalendarComponent } from './calendar/calendar.component';
import { CreateEventFormComponent } from './create-event-form/create-event-form.component';

@NgModule({
  declarations: [CalendarComponent, CreateEventFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    CalendarRoutingModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule,
    ReactiveFormsModule,
    NzCalendarModule,
    NzBadgeModule,
    NzPopoverModule,
  ],
  exports: [],
})
export class CalendarModule {}
