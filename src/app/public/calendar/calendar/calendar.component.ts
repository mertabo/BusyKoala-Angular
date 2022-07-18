import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  selectedDate = new Date();
  prevDate = this.selectedDate;
  calendar!: any;
  events: {} = {};

  formatEventDate(date: Date): string {
    return formatDate(date, 'longDate', 'en-US').toString();
  }

  getCalendar(): void {
    this.calendarService
      .getCalendar()
      .subscribe((data: any) => this.getEvents(data));
  }

  getEvents(data: any): void {
    if (!data.id) return; // no calendar found

    const month = this.selectedDate.getMonth();
    const year = this.selectedDate.getFullYear();

    if (data.events[year]?.[month]) {
      this.events = data.events[year][month];
    } else {
      // no events on selected month & year
      this.events = {};
    }
  }

  // update calendar everytime month/year is changed
  selectChange(select: Date): void {
    if (
      select.getMonth() !== this.prevDate.getMonth() ||
      select.getFullYear() !== this.prevDate.getFullYear()
    ) {
      this.getCalendar();
      this.prevDate = select;
    }
  }

  onSubmitted(eventData: any): void {
    const newEventDate = eventData.date;
    const newEvent = eventData.event;

    if (
      this.selectedDate.getFullYear() === newEventDate.getFullYear() &&
      this.selectedDate.getMonth() === newEventDate.getMonth()
    ) {
      // check if there are existing events in selected date
      let existingDate = Object.entries(this.events).find(([key, value]) => {
        if (key == newEventDate.getDate()) return value;
      })?.[1] as Array<string>;

      this.calendarService.addEvent(newEvent).subscribe((event: any) => {
        // add new event
        if (existingDate) existingDate.push(newEvent);
        else {
          this.events = {
            ...this.events,
            [newEventDate.getDate()]: [event],
          };
        }
      });
    }
  }

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.getCalendar();
  }
}
