import {
  Component,
  DoCheck,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AttendanceMonthlySummary,
  UserTimeData,
  Workspace,
} from 'src/app/shared/models';
import { WorkspacesService } from 'src/app/shared/services/api';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { MONTHS } from 'src/app/shared/constants';

@Component({
  selector: 'app-own-workspace',
  templateUrl: './own-workspace.component.html',
  styleUrls: ['./own-workspace.component.css'],
})
export class OwnWorkspaceComponent implements OnInit, DoCheck, OnDestroy {
  @Input() workspace!: Workspace;
  hasWorkspaceDataLoaded = false;
  ongoing = false;
  buttonView = 'today';
  today = new Date();
  selectedDate = new Date();
  prevSelectedDate = new Date();
  attendeesToday: UserTimeData[] = [];
  attendeesMonth: AttendanceMonthlySummary[] = [];
  private workspaceDiffer!: KeyValueDiffer<string, any>;

  // subscriptions
  updateSessionSubscription?: Subscription;
  refreshSubscription?: Subscription;

  /**
   * Get attendees today.
   */
  getToday(): void {
    this.hasWorkspaceDataLoaded = false;
    this.attendeesToday = [];

    const attendance = this.workspace.attendance;

    if (attendance) {
      const attendanceToday =
        attendance[this.today.getFullYear()]?.[this.today.getMonth()]?.[
          this.today.getDate()
        ];

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
    const attendees = this.workspace.attendance![year]?.[month];

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
    const link = this.workspace.inviteCode;

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
    this.updateSessionSubscription = this.workspacesService
      .updateWorkspace(this.workspace.id!, {
        ongoing: (!this.ongoing).toString(),
      })
      .subscribe((updatedWorkspace) => {
        if (updatedWorkspace.id) {
          this.workspace = updatedWorkspace;
          this.ongoing = updatedWorkspace.ongoing === 'true';
          this.showSessionUpdate();
        }
      });
  }

  /**
   * Shows notification whether the session started or ended.
   */
  showSessionUpdate(): void {
    this.notification.success(
      `Session ${this.ongoing ? 'started' : 'ended'}`,
      `Attendees can ${this.ongoing ? 'now' : 'no longer'} time in.`,
      { nzKey: 'sessionUpdate', nzPlacement: 'bottomRight' }
    );
  }

  /**
   * Gets the latest data of workspace.
   */
  refresh(): void {
    this.refreshSubscription = this.workspacesService
      .getWorkspace(this.workspace.id!)
      .subscribe((workspace) => {
        if (this.workspace) this.workspace = workspace;
      });
  }

  constructor(
    private differs: KeyValueDiffers,
    private workspacesService: WorkspacesService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.workspaceDiffer = this.differs.find(this.workspace).create();
    this.ongoing = this.workspace.ongoing === 'true';
    this.getToday();
  }

  // watch for change in selected workspace
  ngDoCheck(): void {
    const changes = this.workspaceDiffer.diff(this.workspace);

    if (changes) {
      this.ongoing = this.workspace.ongoing === 'true';
      this.getToday();
    }
  }

  ngOnDestroy(): void {
    this.updateSessionSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }
}
