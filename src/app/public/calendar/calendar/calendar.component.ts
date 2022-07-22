import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Calendar, Event } from '../calendar';
import { Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  selectedDate = new Date();
  prevSelectedDate = this.selectedDate;
  calendar!: Calendar;
  events: {} = {};
  isProcessingRequest = false;
  successfulRequest = false;
  hasCalendarLoaded = false;

  // subscriptions
  getCalendarSubscription!: Subscription;
  addEventSubscription?: Subscription;

  /**
   * Get Calendar of logged in user.
   * Can only get calendar with ericka id only since auth is not yet fully implemented.
   */
  getCalendar(): void {
    this.getCalendarSubscription = this.calendarService
      .getCalendar()
      .subscribe((data: Calendar) => {
        this.calendar = data;
        this.getEvents();
      });
  }

  /**
   * Get events of the Calendar on selected date.
   */
  getEvents(): void {
    if (!this.calendar.id) return; // no calendar found

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();

    if (this.calendar.events[year]?.[month]) {
      // found events
      this.events = this.calendar.events[year][month];
    } else {
      // no events on selected month & year
      this.events = {};
    }
    this.hasCalendarLoaded = true;
  }

  /**
   * Update Calendar everytime month/year is changed.
   */
  selectChange(select: Date): void {
    if (
      select.getMonth() !== this.prevSelectedDate.getMonth() ||
      select.getFullYear() !== this.prevSelectedDate.getFullYear()
    ) {
      this.getCalendar();
      this.prevSelectedDate = select;
    }
  }

  /**
   * Triggered when user submitted new event in CreateEventFormComponent.
   *
   * @param eventData: Event - new event to be created
   */
  onSubmitted(eventData: Event): void {
    // only let user submit one request at a time
    this.successfulRequest = false;
    this.isProcessingRequest = true;

    const newEvent = eventData.event;
    const newEventYear = eventData.date.getFullYear();
    const newEventMonth = eventData.date.getMonth();
    const newEventDate = eventData.date.getDate();

    // clone so updates on UI will only happen if adding is successful
    const calendarTemp = cloneDeep(this.calendar);

    if (!calendarTemp.events[newEventYear]) {
      // year not found
      calendarTemp.events[newEventYear] = {
        [newEventMonth]: { [newEventDate]: [newEvent] },
      };
    } else if (!calendarTemp.events[newEventYear][newEventMonth]) {
      // month not found
      calendarTemp.events[newEventYear][newEventMonth] = {
        [newEventDate]: [newEvent],
      };
    } else if (
      !calendarTemp.events[newEventYear][newEventMonth][newEventDate]
    ) {
      // date not found
      calendarTemp.events[newEventYear][newEventMonth][newEventDate] = [
        newEvent,
      ];
    } else {
      // [year][month][date] exists
      calendarTemp.events[newEventYear][newEventMonth][newEventDate].push(
        newEvent
      );
    }

    // add to database then update UI
    this.addEventSubscription = this.calendarService
      .addEvent(calendarTemp)
      .subscribe((data: any) => {
        if (data.id) {
          this.calendar = data;
          this.getEvents();
          this.successfulRequest = true;
        } else {
          this.successfulRequest = false;
        }
        this.showNotification();
        this.isProcessingRequest = false;
      });
  }

  /**
   * Shows notification whether the creation of event was a success or an error.
   */
  showNotification(): void {
    if (this.successfulRequest) {
      this.notification.success(
        'New event added',
        'Your new event has been successfully added to your calendar! :)',
        { nzPlacement: 'bottomRight' }
      );
    } else {
      this.notification.error(
        'New event failed',
        'Your new event failed to be added to your calendar! :(',
        { nzPlacement: 'bottomRight' }
      );
    }
  }

  constructor(
    private calendarService: CalendarService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getCalendar();
  }

  ngOnDestroy(): void {
    this.getCalendarSubscription.unsubscribe();
    this.addEventSubscription?.unsubscribe();
  }
}
