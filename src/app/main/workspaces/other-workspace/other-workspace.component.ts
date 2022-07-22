import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
import { Subscription } from 'rxjs';
import { militaryToStandardTimeFormat } from 'src/app/shared/utils/utils';
import {
  LOGGEDIN_USER,
  MONTHS,
  TIME_SEPARATOR,
} from '../../../shared/constants/constants';
import { UserTimeData, Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'app-other-workspace',
  templateUrl: './other-workspace.component.html',
  styleUrls: ['./other-workspace.component.css'],
})
export class OtherWorkspaceComponent implements OnInit, OnDestroy {
  @Input() workspace!: Workspace;
  localWorkspace!: Workspace;
  hasWorkspaceDataLoaded = false;
  selectedMonth = new Date();
  prevSelectedMonth = new Date();
  timeInOutData: UserTimeData[] = [];
  dates: string[] = []; // dates (in string format) of the cards
  isTimedIn: boolean = false;

  // subscriptions
  timeInSubscription?: Subscription;
  timeOutSubscription?: Subscription;

  /**
   * Get logged in user's time in/out date in a workspace.
   */
  getTimeInOutData(): void {
    this.hasWorkspaceDataLoaded = false;

    this.timeInOutData = [];
    const attendance = this.localWorkspace.attendance;

    if (attendance) {
      const year = this.selectedMonth.getFullYear();
      const month = this.selectedMonth.getMonth();
      const monthlyData = attendance[year]?.[month];

      if (!monthlyData) return;

      Object.entries(monthlyData).forEach(([date, value]) => {
        const attendees: UserTimeData[] = value;

        // get data that belongs to the logged in user
        const filteredDates = attendees.filter(
          (attendee: UserTimeData) => attendee.user === LOGGEDIN_USER
        )[0];

        if (filteredDates) {
          this.timeInOutData.push(filteredDates);

          // get date
          const dateWithUserTime = `${MONTHS[Number(month)]} ${date}, ${year}`;
          this.dates.push(dateWithUserTime);
        }
      });
    }

    this.checkIfCurrentlyTimedIn();
    this.hasWorkspaceDataLoaded = true;
  }

  /**
   * Checks if user is currently timed in.
   */
  checkIfCurrentlyTimedIn(): void {
    const timeInOutDataLength = this.timeInOutData.length;

    if (timeInOutDataLength < 1) return;

    // checks the latest data in timeInOutData
    if (
      this.timeInOutData[timeInOutDataLength - 1].time[
        this.timeInOutData[timeInOutDataLength - 1].time.length - 1
      ].split(TIME_SEPARATOR).length < 2
    ) {
      this.isTimedIn = true;
    }
  }

  /**
   * Handles changes on date-picker.
   * Get logged in user's time in/out date in a workspace.
   *
   * @param isOpen: boolean - true if open, false if not open
   */
  onClose(isOpen: boolean) {
    if (
      isOpen ||
      !this.prevSelectedMonth ||
      !this.selectedMonth ||
      (this.prevSelectedMonth.getFullYear() ===
        this.selectedMonth.getFullYear() &&
        this.prevSelectedMonth.getMonth() === this.selectedMonth.getMonth())
    )
      return;

    this.getTimeInOutData();
    this.prevSelectedMonth = this.selectedMonth;
  }

  /**
   * Handles the action of timing in.
   */
  timeIn(): void {
    this.isTimedIn = true;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const newTimeInData: UserTimeData = {
      user: LOGGEDIN_USER,
      time: [militaryToStandardTimeFormat(now)],
      duration: 0,
    };

    // do not manipulate original data in case of failed process
    const tempLocalWorkspace = cloneDeep(this.localWorkspace);

    // update the tempLocalWorkspace accordingly
    if (!this.localWorkspace.attendance[year]) {
      // year not found
      tempLocalWorkspace.attendance[year] = {
        [month]: { [date]: [newTimeInData] },
      };
    } else if (!this.localWorkspace.attendance[year][month]) {
      // month not found
      tempLocalWorkspace.attendance[year][month] = { [date]: [newTimeInData] };
    } else if (!this.localWorkspace.attendance[year][month][date]) {
      // date not found
      tempLocalWorkspace.attendance[year][month][date] = [newTimeInData];
    } else {
      // existing data
      const attendeeIndex = this.localWorkspace.attendance[year][month][
        date
      ].findIndex((attendee: UserTimeData) => attendee.user === LOGGEDIN_USER);

      // user has no time in data yet
      if (attendeeIndex < 0) {
        tempLocalWorkspace.attendance[year][month][date].push(newTimeInData);
      } else {
        // user already has time in data
        tempLocalWorkspace.attendance[year][month][date][
          attendeeIndex
        ].time.push(newTimeInData.time[0]);
      }
    }

    // update the db and UI
    this.timeInSubscription = this.workspacesService
      .updateWorkspace(tempLocalWorkspace)
      .subscribe((updatedWorkspace) => {
        if (updatedWorkspace.id) {
          this.localWorkspace = updatedWorkspace;

          const dateIndex = this.dates.indexOf(
            `${MONTHS[Number(month)]} ${date}, ${year}`
          );
          if (dateIndex < 0) {
            this.dates.push(`${MONTHS[Number(month)]} ${date}, ${year}`);
            this.timeInOutData.unshift(newTimeInData);
          } else {
            this.timeInOutData[this.timeInOutData.length - 1].time.push(
              newTimeInData.time[0]
            );
          }
        } else {
          this.isTimedIn = false;
        }
      });
  }

  /**
   * Handles the action of timing out.
   * Triggered by time out from TimeInOutComponent.
   */
  timeOut(newData: { date: Date; updatedUserTimeData: UserTimeData }): void {
    const userTimeDataDate = newData.date;
    const updatedUserTimeData = newData.updatedUserTimeData;

    if (!userTimeDataDate || !updatedUserTimeData) return;

    const year = userTimeDataDate.getFullYear();
    const month = userTimeDataDate.getMonth();
    const date = userTimeDataDate.getDate();

    // find attendee data to be updated
    const attendeeIndex = this.localWorkspace.attendance[year][month][
      date
    ].findIndex(
      (attendee: UserTimeData) => attendee.user === updatedUserTimeData.user
    );

    // update data of attendee
    this.localWorkspace.attendance[year][month][date][attendeeIndex] =
      updatedUserTimeData;
    this.timeOutSubscription = this.workspacesService
      .updateWorkspace(this.localWorkspace)
      .subscribe((updatedWorkspace) => {
        if (updatedWorkspace.id) {
          this.localWorkspace = updatedWorkspace;
          this.getTimeInOutData();
        }
      });

    this.isTimedIn = false;
  }

  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {}

  ngOnInit(): void {
    this.localWorkspace = cloneDeep(this.workspace);
    this.getTimeInOutData();
  }

  ngOnDestroy(): void {
    this.timeInSubscription?.unsubscribe();
    this.timeOutSubscription?.unsubscribe();
  }
}
