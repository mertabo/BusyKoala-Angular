import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';

import { CalendarComponent } from './calendar/calendar.component';
import { CreateEventFormComponent } from './create-event-form/create-event-form.component';
import { MonthsComponent } from './months/months.component';

@NgModule({
  declarations: [CalendarComponent, CreateEventFormComponent, MonthsComponent],
  imports: [CommonModule, CalendarRoutingModule],
  exports: [MonthsComponent],
})
export class CalendarModule {}
