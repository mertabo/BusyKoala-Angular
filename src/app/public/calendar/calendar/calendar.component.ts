import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Calendar, CalendarEvent } from '../calendar';
import { Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import cloneDeep from 'lodash/cloneDeep';
import { AuthService } from 'src/app/auth/auth.service';

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
  loggedInUser = '';

  // subscriptions
  getCalendarSubscription?: Subscription;
  createCalendarSubscription?: Subscription;
  addEventSubscription?: Subscription;

  /**
   * Get Calendar of logged in user.
   */
  getCalendar(): void {
    this.hasCalendarLoaded = false;
    this.getCalendarSubscription = this.calendarService
      .getCalendar(this.loggedInUser)
      .subscribe((data: Calendar) => {
        if (data.id) {
          this.calendar = data;
          this.getEvents();
          this.showNotification(
            true,
            'Calendar successfully loaded',
            'Your calendar is now ready! :)'
          );
        } else {
          this.hasCalendarLoaded = true;
        }
      });
  }

  /**
   * Get events of the Calendar on selected date.
   */
  getEvents(): void {
    if (!this.calendar?.id) return; // no calendar found

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
  selectChange(): void {
    if (
      this.selectedDate.getMonth() !== this.prevSelectedDate.getMonth() ||
      this.selectedDate.getFullYear() !== this.prevSelectedDate.getFullYear()
    ) {
      this.getEvents();
      this.prevSelectedDate = this.selectedDate;
    }
  }

  /**
   * Triggered when user submitted new event in CreateEventFormComponent.
   *
   * @param eventData: Event - new event to be created
   */
  onSubmitted(eventData: { date: Date; event: CalendarEvent }): void {
    // only let user submit one request at a time
    this.successfulRequest = false;
    this.isProcessingRequest = true;

    const newEvent = eventData.event;
    const newEventYear = eventData.date.getFullYear();
    const newEventMonth = eventData.date.getMonth();
    const newEventDate = eventData.date.getDate();

    // clone so updates on UI will only happen if adding is successful
    const calendarTemp = cloneDeep(this.calendar);

    // check if user has no calendar yet
    if (!calendarTemp && this.loggedInUser) {
      // create calendar
      const newCalendar: Calendar = {
        id: this.loggedInUser,
        events: {
          [newEventYear]: {
            [newEventMonth]: {
              [newEventDate]: [newEvent],
            },
          },
        },
      };

      this.createCalendarSubscription = this.calendarService
        .createCalendar(newCalendar)
        .subscribe((calendar: any) => {
          if (calendar.id) {
            this.calendar = calendar;
            this.getEvents();
            this.successfulRequest = true;
            this.showNotification(
              true,
              'New event added',
              'Your new event has been successfully added to your calendar! :)'
            );
          } else {
            this.successfulRequest = false;
            this.showNotification(
              false,
              'New event failed',
              'Your new event failed to be added to your calendar! :('
            );
          }
          this.isProcessingRequest = false;
        });
    } else if (!calendarTemp) {
      return;
    } else {
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
        .subscribe((updatedCalendar: any) => {
          if (updatedCalendar.id) {
            this.calendar = updatedCalendar;
            this.getEvents();
            this.successfulRequest = true;
            this.showNotification(
              true,
              'New event added',
              'Your new event has been successfully added to your calendar! :)'
            );
          } else {
            this.successfulRequest = false;
            this.showNotification(
              false,
              'New event failed',
              'Your new event failed to be added to your calendar! :('
            );
          }
          this.isProcessingRequest = false;
        });
    }
  }

  /**
   * Shows notification whether a process was a success or an error.
   *
   * @param status: boolean - true for success, false for error
   * @param title: string - title of the notification
   * @param content: strong - content in the body of the notification
   */
  showNotification(status: boolean, title: string, content: string): void {
    if (status) {
      this.notification.success(title, content, { nzPlacement: 'bottomRight' });
    } else {
      this.notification.error(title, content, { nzPlacement: 'bottomRight' });
    }
  }

  constructor(
    private calendarService: CalendarService,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    // get the logged in user
    this.loggedInUser = this.authService.loggedInUser;

    if (this.loggedInUser) {
      this.getCalendar();
    } else {
      this.hasCalendarLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.getCalendarSubscription?.unsubscribe();
    this.createCalendarSubscription?.unsubscribe();
    this.addEventSubscription?.unsubscribe();
  }
}
