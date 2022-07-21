import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LOGGEDIN_USER } from '../../constants/auth';
import { MONTHS } from '../../constants/calendar';
import { Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'app-other-workspace',
  templateUrl: './other-workspace.component.html',
  styleUrls: ['./other-workspace.component.css'],
})
export class OtherWorkspaceComponent implements OnInit {
  selectedMonth = new Date();
  prevSelectedMonth = new Date();
  workspace?: Workspace;
  timeInOutData: any[] = [];
  dates: string[] = [];

  getWorkspace(id: string): void {
    this.workspacesService.getWorkspace(id).subscribe((data: Workspace) => {
      this.workspace = data;
      if (data) {
        this.getTimeInOutData();
      }
    });
  }

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

  getTimeInOutData(): void {
    this.timeInOutData = [];
    const attendance = this.workspace?.attendance;

    if (attendance) {
      const year = this.selectedMonth.getFullYear();
      const month = this.selectedMonth.getMonth();
      const data = attendance[year]?.[month];

      if (!data) return;

      Object.entries(data).forEach(([key, value]) => {
        const dates: any = value;
        const filteredDates = dates.filter(
          (dateData: any) => dateData.user === LOGGEDIN_USER
        )[0];

        if (filteredDates) {
          this.timeInOutData.push(filteredDates);

          // get date
          const date = `${MONTHS[Number(month)]} ${key}, ${year}`;
          this.dates.push(date);
        }
      });
      // this.selectedMonth.setMonth(3);
      // this.selectedMonth.setFullYear(2021);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {}

  ngOnInit(): void {
    let selectedWorkspaceID = this.route.snapshot.paramMap.get('id')!;
    this.getWorkspace(selectedWorkspaceID);
  }
}
