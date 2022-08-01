import {
  Component,
  DoCheck,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
} from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MONTHS, TIME_SEPARATOR } from 'src/app/shared/constants';
import { UserTimeData, Workspace } from 'src/app/shared/models';
import { WorkspacesService } from 'src/app/shared/services/api';
import { MESSAGE } from 'src/app/shared/constants';
import { DateUtilService } from 'src/app/shared/services/util';

@Component({
  selector: 'app-other-workspace',
  templateUrl: './other-workspace.component.html',
  styleUrls: ['./other-workspace.component.css'],
})
export class OtherWorkspaceComponent implements OnInit, DoCheck, OnDestroy {
  @Input() workspace!: Workspace;
  localWorkspace!: Workspace;
  hasWorkspaceDataLoaded = false;
  selectedMonth = new Date();
  prevSelectedMonth = new Date();
  loggedInUser = '';
  timeInOutData: UserTimeData[] = [];
  dates: string[] = []; // dates (in string format) of the cards
  isTimedIn: boolean = false;
  private workspaceDiffer!: KeyValueDiffer<string, any>;

  // subscriptions
  timeInSubscription?: Subscription;
  timeOutSubscription?: Subscription;
  checkIfOngoingSubscription?: Subscription;

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

      if (monthlyData) {
        Object.entries(monthlyData).forEach(([date, value]) => {
          const attendees: UserTimeData[] = value;

          // get data that belongs to the logged in user
          const filteredDates = attendees.filter(
            (attendee: UserTimeData) => attendee.user === this.loggedInUser
          )[0];

          if (filteredDates) {
            this.timeInOutData.unshift(filteredDates);

            // get date
            const dateWithUserTime = `${
              MONTHS[Number(month)]
            } ${date}, ${year}`;
            this.dates.unshift(dateWithUserTime);
          }
        });
      }
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
      this.timeInOutData[0].time[this.timeInOutData[0].time.length - 1].split(
        TIME_SEPARATOR
      ).length < 2
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
    console.log(this.localWorkspace.ongoing === 'true');
    this.isTimedIn = true;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const newTimeInData: UserTimeData = {
      user: this.loggedInUser,
      time: [this.dateUtilService.militaryToStandardTimeFormat(now)],
      duration: 0,
    };

    // check if workspace is still ongoing
    this.checkIfOngoingSubscription = this.workspacesService
      .getWorkspace(this.localWorkspace.id!)
      .subscribe((workspace) => {
        if (!workspace.id) {
          // error in server
          this.message.error(MESSAGE.GENERIC_FAILED);
        } else if (!workspace.ongoing) {
          // workspace has ended session
          this.localWorkspace = workspace;
          this.message.error(MESSAGE.TIME_IN_FAILED_SESSION_ENDED);
        } else {
          // do not manipulate original data in case of failed process
          const tempAttendance = cloneDeep(this.localWorkspace.attendance!);

          // update the tempAttendance accordingly
          if (!this.localWorkspace.attendance![year]) {
            // year not found
            tempAttendance[year] = {
              [month]: { [date]: [newTimeInData] },
            };
          } else if (!this.localWorkspace.attendance![year][month]) {
            // month not found
            tempAttendance[year][month] = {
              [date]: [newTimeInData],
            };
          } else if (!this.localWorkspace.attendance![year][month][date]) {
            // date not found
            tempAttendance[year][month][date] = [newTimeInData];
          } else {
            // existing data
            const attendeeIndex = this.localWorkspace.attendance![year][month][
              date
            ].findIndex(
              (attendee: UserTimeData) => attendee.user === this.loggedInUser
            );

            // user has no time in data yet
            if (attendeeIndex < 0) {
              tempAttendance[year][month][date].push(newTimeInData);
            } else {
              // user already has time in data
              tempAttendance[year][month][date][attendeeIndex].time.push(
                newTimeInData.time[0]
              );
            }
          }
          const test = { attendance: tempAttendance };
          // update the db and UI
          this.timeInSubscription = this.workspacesService
            .updateWorkspace(this.localWorkspace.id!, {
              attendance: tempAttendance,
            })
            .subscribe((updatedWorkspace) => {
              if (updatedWorkspace.id) {
                this.localWorkspace = updatedWorkspace;

                const dateIndex = this.dates.indexOf(
                  `${MONTHS[Number(month)]} ${date}, ${year}`
                );
                if (dateIndex < 0) {
                  this.dates.unshift(
                    `${MONTHS[Number(month)]} ${date}, ${year}`
                  );
                  this.timeInOutData.unshift(newTimeInData);
                } else {
                  this.timeInOutData[0].time.push(newTimeInData.time[0]);
                }

                this.message.success(MESSAGE.TIME_IN_SUCCESS);
              } else {
                this.isTimedIn = false;
              }
            });
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
    const attendeeIndex = this.localWorkspace.attendance![year][month][
      date
    ].findIndex(
      (attendee: UserTimeData) => attendee.user === updatedUserTimeData.user
    );

    // do not manipulate original data in case of failed process
    const tempAttendance = cloneDeep(this.localWorkspace.attendance);

    // update data of attendee
    tempAttendance![year][month][date][attendeeIndex] = updatedUserTimeData;
    this.timeOutSubscription = this.workspacesService
      .updateWorkspace(this.localWorkspace.id!, { attendance: tempAttendance })
      .subscribe((updatedWorkspace) => {
        if (updatedWorkspace.id) {
          this.localWorkspace = updatedWorkspace;
          this.getTimeInOutData();
          this.message.success(MESSAGE.TIME_OUT_SUCCESS);
        }
      });

    this.isTimedIn = false;
  }

  constructor(
    private differs: KeyValueDiffers,
    private workspacesService: WorkspacesService,
    private authService: AuthService,
    private message: NzMessageService,
    private dateUtilService: DateUtilService
  ) {}

  ngOnInit(): void {
    this.workspaceDiffer = this.differs.find(this.workspace).create();
    this.localWorkspace = cloneDeep(this.workspace);
    this.loggedInUser = this.authService.loggedInUser;
    this.getTimeInOutData();
  }

  ngDoCheck(): void {
    // watch for change in selected workspace
    const changes = this.workspaceDiffer.diff(this.workspace);

    if (changes) {
      this.localWorkspace = cloneDeep(this.workspace);
      this.getTimeInOutData();
    }
  }

  ngOnDestroy(): void {
    this.timeInSubscription?.unsubscribe();
    this.timeOutSubscription?.unsubscribe();
    this.checkIfOngoingSubscription?.unsubscribe();
  }
}
