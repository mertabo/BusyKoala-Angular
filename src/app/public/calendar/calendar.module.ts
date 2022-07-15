import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

import { CalendarRoutingModule } from './calendar-routing.module';

import { CalendarComponent } from './calendar/calendar.component';
import { CreateEventFormComponent } from './create-event-form/create-event-form.component';
import { MonthsComponent } from './months/months.component';

@NgModule({
  declarations: [CalendarComponent, CreateEventFormComponent, MonthsComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule,
    ReactiveFormsModule,
  ],
  exports: [MonthsComponent],
})
export class CalendarModule {}
