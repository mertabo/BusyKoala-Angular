import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Calendar, CalendarEvent } from 'src/app/shared/models';
import { Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import cloneDeep from 'lodash/cloneDeep';
import { AuthService } from 'src/app/auth/auth.service';
import { generateRandomCode } from 'src/app/shared/utils/utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/shared/constants';

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
  deleteEventSubscription?: Subscription;

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
            MESSAGE.CALENDAR_SUCCESS_TITLE,
            MESSAGE.CALENDAR_SUCCESS_CONTENT
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

    // check if guest is trying to create event or a valid user with no calendar yet
    if (!calendarTemp) {
      let calendarId = this.loggedInUser;

      if (!calendarId) {
        // guest
        let tempUser = localStorage.getItem('temp_user');

        if (tempUser) {
          // the guest already has calendar data
          calendarId = tempUser;
        } else {
          // guest has no calendar data yet
          calendarId = generateRandomCode();
          localStorage.setItem('temp_user', calendarId);
        }
      }

      // create calendar
      const newCalendar: Calendar = {
        id: calendarId,
        events: {
          [newEventYear]: {
            [newEventMonth]: {
              [newEventDate]: [newEvent],
            },
          },
        },
      };

      // create calendar
      this.createCalendarSubscription = this.calendarService
        .createCalendar(newCalendar)
        .subscribe((calendar: any) => {
          if (calendar.id) {
            this.calendar = calendar;
            this.getEvents();
            this.successfulRequest = true;
            this.showNotification(
              true,
              MESSAGE.CREATE_EVENT_SUCCESS_TITLE,
              MESSAGE.CREATE_EVENT_SUCCESS_CONTENT
            );
          } else {
            this.successfulRequest = false;
            this.showNotification(
              false,
              MESSAGE.CREATE_EVENT_FAILED_TITLE,
              MESSAGE.CREATE_EVENT_FAILED_CONTENT
            );
          }
          this.isProcessingRequest = false;
        });
    } else {
      // logged in and has calendar data
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
              MESSAGE.CREATE_EVENT_SUCCESS_TITLE,
              MESSAGE.CREATE_EVENT_SUCCESS_CONTENT
            );
          } else {
            this.successfulRequest = false;
            this.showNotification(
              false,
              MESSAGE.CREATE_EVENT_FAILED_TITLE,
              MESSAGE.CREATE_EVENT_FAILED_CONTENT
            );
          }
          this.isProcessingRequest = false;
        });
    }
  }

  /**
   * Opens a confirmation dialog before deleting an event.
   *
   * @param date: Date - date of the event to be deleted
   * @param event: CalendarEvent - the event to be deleted
   * @param index: number - index of event from the array of events
   */
  confirmDelete(date: Date, event: CalendarEvent, index: number): void {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete "${event.title}"?`,
      nzContent: MESSAGE.CONFIRM_DELETE_EVENT_CONTENT,
      nzOnOk: () => this.deleteEvent(date, event, index),
    });
  }

  /**
   * Deletes an event
   *
   * @param date: Date - date of the event to be deleted
   * @param event: CalendarEvent - the event to be deleted
   * @param index: number - index of event from the array of events
   */
  deleteEvent(date: Date, event: CalendarEvent, index: number): void {
    const tempCalendar = cloneDeep(this.calendar);

    if (!tempCalendar.id) return;

    if (index > -1) {
      // only splice array when item is found
      tempCalendar.events[date.getFullYear()][date.getMonth()][
        date.getDate()
      ].splice(index, 1);

      // if date has now empty array, remove date
      if (
        tempCalendar.events[date.getFullYear()][date.getMonth()][date.getDate()]
          .length === 0
      ) {
        const eventDate = date.getDate();

        const { [eventDate]: number, ...updatedMonthEvents } =
          tempCalendar.events[date.getFullYear()][date.getMonth()];

        tempCalendar.events[date.getFullYear()][date.getMonth()] =
          updatedMonthEvents;
      }

      // delete event in database and reflect result in ui
      this.deleteEventSubscription = this.calendarService
        .updateCalendar(tempCalendar)
        .subscribe((updatedCalendar) => {
          if (updatedCalendar.id) {
            this.calendar = updatedCalendar;
            this.getEvents();
            this.showNotification(
              true,
              MESSAGE.DELETE_EVENT_SUCCESS_TITLE,
              MESSAGE.DELETE_EVENT_SUCCESS_CONTENT
            );
          } else {
            this.showNotification(
              false,
              MESSAGE.DELETE_EVENT_FAILED_TITLE,
              MESSAGE.DELETE_EVENT_FAILED_CONTENT
            );
          }
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
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    // get the logged in user
    this.loggedInUser = this.authService.loggedInUser;
    const tempUser = localStorage.getItem('temp_user');

    if (this.loggedInUser) {
      // a valid user
      this.getCalendar();
    } else if (tempUser) {
      // a guest
      this.loggedInUser = tempUser;
      this.getCalendar();
    } else {
      this.hasCalendarLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.getCalendarSubscription?.unsubscribe();
    this.createCalendarSubscription?.unsubscribe();
    this.addEventSubscription?.unsubscribe();
    this.deleteEventSubscription?.unsubscribe();
  }
}
