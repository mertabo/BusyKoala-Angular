import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'app-own-workspace',
  templateUrl: './own-workspace.component.html',
  styleUrls: ['./own-workspace.component.css'],
})
export class OwnWorkspaceComponent implements OnInit {
  buttonView = 'today';
  today = new Date();
  workspace?: Workspace;
  attendeesToday: any[] = [];

  getWorkspace(id: string): void {
    this.workspacesService.getWorkspace(id).subscribe((data: Workspace) => {
      this.workspace = data;
      if (data) {
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

  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {}

  ngOnInit(): void {
    let selectedWorkspaceID = this.route.snapshot.paramMap.get('id')!;
    this.getWorkspace(selectedWorkspaceID);
  }
}
