import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AttendanceMonthlySummary,
  UserTimeData,
  Workspace,
} from '../workspaces';
import { WorkspacesService } from '../workspaces.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { MONTHS } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-own-workspace',
  templateUrl: './own-workspace.component.html',
  styleUrls: ['./own-workspace.component.css'],
})
export class OwnWorkspaceComponent implements OnInit, OnDestroy {
  @Input() workspace!: Workspace;
  hasWorkspaceDataLoaded = false;
  ongoing = '';
  buttonView = 'today';
  today = new Date();
  selectedDate = new Date();
  prevSelectedDate = new Date();
  attendeesToday: UserTimeData[] = [];
  attendeesMonth: AttendanceMonthlySummary[] = [];

  // subscriptions
  updateSessionSubscription?: Subscription;

  /**
   * Get attendees today.
   */
  getToday(): void {
    this.hasWorkspaceDataLoaded = false;

    const attendance = this.workspace.attendance;

    if (attendance) {
      const attendanceToday =
        attendance[this.today.getFullYear()]?.[this.today.getMonth()]?.['31'];

      if (attendanceToday) {
        this.attendeesToday = attendanceToday;
      }
    }

    this.hasWorkspaceDataLoaded = true;
  }

  /**
   * Handles the changes in date-picker.
   */
  onClose(isOpen: boolean): void {
    if (
      isOpen ||
      !this.prevSelectedDate ||
      !this.selectedDate ||
      (this.prevSelectedDate.getFullYear() ===
        this.selectedDate.getFullYear() &&
        this.prevSelectedDate.getMonth() === this.selectedDate.getMonth())
    )
      return;

    this.getMonthSummary();
    this.prevSelectedDate = this.selectedDate;
  }

  /**
   * Get summary of attendees of the month.
   */
  getMonthSummary(): void {
    if (!this.selectedDate) return;

    this.hasWorkspaceDataLoaded = false;

    this.attendeesMonth = [];

    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const attendees = this.workspace!.attendance[year]?.[month];

    if (attendees) {
      Object.entries(attendees).forEach(([date, attendees]) => {
        this.attendeesMonth.push({
          date: `${
            MONTHS[this.selectedDate.getMonth()]
          } ${date}, ${this.selectedDate.getFullYear()}`,
          attendees,
        });
      });
    }

    this.hasWorkspaceDataLoaded = true;
  }

  /**
   * Shows a notification about the invite link and copies link to clipboard.
   */
  showInviteLink(): void {
    const link = this.workspace!.inviteCode;

    navigator.clipboard.writeText(`https://busykoala.com/invite?code=${link}`);

    this.notification.info(
      'Invite link',
      `Your session invite link has been copied to your clipboard: https://busykoala.com/invite?code=${link}`,
      { nzKey: 'inviteLink', nzPlacement: 'bottomRight' }
    );
  }

  /**
   * Updates the 'ongoing' property of a Workspace.
   */
  updateSession(): void {
    this.workspace!.ongoing = this.ongoing === 'Start' ? 'true' : 'false';

    this.updateSessionSubscription = this.workspacesService
      .updateWorkspace(this.workspace!)
      .subscribe((data) => {
        this.workspace = data;
        this.showSessionUpdate();
        this.ongoing = data.ongoing === 'true' ? 'End' : 'Start';
      });
  }

  /**
   * Shows notification whether the session started or ended.
   */
  showSessionUpdate(): void {
    this.notification.success(
      `Session ${this.ongoing.toLowerCase()}ed`,
      `Attendees can ${
        this.ongoing === 'Start' ? 'now' : 'no longer'
      } time in.`,
      { nzKey: 'sessionUpdate', nzPlacement: 'bottomRight' }
    );
  }

  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.ongoing = this.workspace.ongoing === 'true' ? 'End' : 'Start';
    this.getToday();
  }

  ngOnDestroy(): void {
    this.updateSessionSubscription?.unsubscribe();
  }
}
