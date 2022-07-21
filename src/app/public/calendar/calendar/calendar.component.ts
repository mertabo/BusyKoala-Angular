import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { CalendarService } from '../calendar.service';
import { Calendar } from '../calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  selectedDate = new Date();
  prevDate = this.selectedDate;
  calendar?: any;
  events: {} = {};

  formatEventDate(date: Date): string {
    return formatDate(date, 'longDate', 'en-US').toString();
  }

  getCalendar(): void {
    this.calendarService.getCalendar().subscribe((data: Calendar) => {
      this.calendar = data;
      this.getEvents();
    });
  }

  getEvents(): void {
    if (!this.calendar.id) return; // no calendar found

    const month = this.selectedDate.getMonth();
    const year = this.selectedDate.getFullYear();

    if (this.calendar.events[year]?.[month]) {
      this.events = this.calendar.events[year][month];
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
    const newEvent = eventData.event;
    const newEventYear = eventData.date.getFullYear();
    const newEventMonth = eventData.date.getMonth();
    const newEventDate = eventData.date.getDate();

    console.log(newEvent);
    if (!this.calendar.events[newEventYear]) {
      // year not found
      this.calendar.events[newEventYear] = {
        [newEventMonth]: { [newEventDate]: [newEvent] },
      };
    } else if (
      // month not found
      !this.calendar.events[newEventYear][newEventMonth]
    ) {
      this.calendar.events[newEventYear][newEventMonth] = {
        [newEventDate]: [newEvent],
      };
    } else if (
      // date not found
      !this.calendar.events[newEventYear][newEventMonth][newEventDate]
    ) {
      this.calendar.events[newEventYear][newEventMonth][newEventDate] = [
        newEvent,
      ];
    } else {
      // [year][month][date] exists
      this.calendar.events[newEventYear][newEventMonth][newEventDate].push(
        newEvent
      );
    }

    this.calendarService.addEvent(this.calendar).subscribe((data: any) => {
      this.calendar = data;
      this.getEvents();
    });
  }

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.getCalendar();
  }
}
