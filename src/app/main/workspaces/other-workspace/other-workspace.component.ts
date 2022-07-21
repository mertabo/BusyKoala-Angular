import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { militaryToStandardTimeFormat } from 'src/app/shared/utils/date';
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
  isTimedIn: boolean = false;

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
    this.timeInOutData.reverse();
    this.checkIfCurrentlyTimedIn();
  }

  checkIfCurrentlyTimedIn(): void {
    if (
      this.timeInOutData[0].time[this.timeInOutData[0].time.length - 1].split(
        ' - '
      ).length < 2
    ) {
      this.isTimedIn = true;
    }
  }

  timeIn(): void {
    this.isTimedIn = true;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const newTimeInData = {
      user: LOGGEDIN_USER,
      time: [militaryToStandardTimeFormat(now)],
      duration: '0mins',
    };

    if (!this.workspace!.attendance[year]) {
      this.workspace!.attendance[year] = {
        [month]: { [date]: [newTimeInData] },
      };
    } else if (!this.workspace!.attendance[year][month]) {
      this.workspace!.attendance[year][month] = { [date]: [newTimeInData] };
    } else if (!this.workspace!.attendance[year][month][date]) {
      this.workspace!.attendance[year][month][date] = [newTimeInData];
    } else {
      const attendeeIndex = this.workspace!.attendance[year][month][
        date
      ].findIndex((attendee: any) => attendee.user === LOGGEDIN_USER);

      // user has no time in data yet
      if (attendeeIndex < 0) {
        this.workspace!.attendance[year][month][date].push(newTimeInData);
      } else {
        // user already has time in data
        this.workspace!.attendance[year][month][date][attendeeIndex].time.push(
          newTimeInData.time[0]
        );
      }
    }

    this.workspacesService
      .updateWorkspace(this.workspace!)
      .subscribe((updatedWorkspace) => {
        this.workspace = updatedWorkspace;
        // check if date already existing
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
      });
  }

  timeOut(newData: any): void {
    const date = newData.date;
    const data = newData.tempData;

    if (!date || !data) return;

    // passed data
    const tempYear = date.getFullYear();
    const tempMonth = date.getMonth();
    const tempDate = date.getDate();

    // find attendee data to be updated
    const attendeeIndex = this.workspace!.attendance[tempYear][tempMonth][
      tempDate
    ].findIndex((attendee: any) => attendee.user === data.user);

    // update data of attendee
    this.workspace!.attendance[tempYear][tempMonth][tempDate][attendeeIndex] =
      data;
    this.workspacesService
      .updateWorkspace(this.workspace!)
      .subscribe((updatedWorkspace) => {
        this.workspace = updatedWorkspace;
      });

    this.isTimedIn = false;
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
