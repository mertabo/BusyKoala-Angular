import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MONTHS } from '../../constants/calendar';
import { Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-own-workspace',
  templateUrl: './own-workspace.component.html',
  styleUrls: ['./own-workspace.component.css'],
})
export class OwnWorkspaceComponent implements OnInit {
  buttonView = 'today';
  today = new Date();
  month = new Date();
  prevMonth = new Date();
  workspace?: Workspace;
  attendeesToday: any[] = [];
  attendeesMonth?: any;
  MONTHS = MONTHS;
  ongoing = 'Start';

  getWorkspace(id: string): void {
    this.workspacesService.getWorkspace(id).subscribe((data: Workspace) => {
      this.workspace = data;
      if (data) {
        this.ongoing = data.ongoing === 'true' ? 'End' : 'Start';
        this.getToday();
      }
    });
  }

  getToday(): void {
    const attendance = this.workspace?.attendance;

    if (attendance) {
      const data =
        attendance[this.today.getFullYear()]?.[this.today.getMonth()]?.['31'];

      if (data) {
        this.attendeesToday = data;
      }
    }
  }

  onClose(isOpen: boolean): void {
    if (
      isOpen ||
      !this.prevMonth ||
      !this.month ||
      (this.prevMonth.getFullYear() === this.month.getFullYear() &&
        this.prevMonth.getMonth() === this.month.getMonth())
    )
      return;

    this.getMonth();
    this.prevMonth = this.month;
  }

  getMonth(): void {
    this.attendeesMonth = {};

    const year = this.month.getFullYear();
    const month = this.month.getMonth();
    const data = this.workspace?.attendance[year]?.[month];

    if (!data) return;

    this.attendeesMonth = data;
  }

  showInviteLink(): void {
    const link = this.workspace!.code;

    navigator.clipboard.writeText(`https://busykoala.com/invite?code=${link}`);

    this.notification.info(
      'Invite link',
      `Your session invite link has been copied to your clipboard: https://busykoala.com/invite?code=${link}`,
      { nzKey: 'inviteLink', nzPlacement: 'bottomRight' }
    );
  }

  updateSession(): void {
    this.workspace!.ongoing = this.ongoing === 'Start' ? 'true' : 'false';

    this.workspacesService
      .updateWorkspace(this.workspace!)
      .subscribe((data) => {
        this.workspace = data;
        this.ongoing = data.ongoing === 'true' ? 'End' : 'Start';
        this.showSessionUpdate();
      });
  }

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
    let selectedWorkspaceID = this.route.snapshot.paramMap.get('id')!;
    this.getWorkspace(selectedWorkspaceID);
  }
}
