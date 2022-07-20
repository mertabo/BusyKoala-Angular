import { Component, OnInit, Output } from '@angular/core';
import { WorkspacesService } from '../workspaces.service';
import { Workspace } from '../workspaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrls: ['./workspaces-list.component.css'],
})
export class WorkspacesListComponent implements OnInit {
  workspaces: Workspace[] = [];
  selectedWorkspace?: Workspace;

  getWorkspaces(): void {
    this.workspacesService.getWorkspaces().subscribe((data: any) => {
      this.workspaces = data;

      if (data) {
        this.selectedWorkspace = data[0];
        this.router.navigate([this.selectedWorkspace!.id], {
          relativeTo: this.route,
        });
      }
    });
  }

  selectWorkspace(workspace: Workspace): void {
    this.selectedWorkspace = workspace;
  }

  constructor(
    private workspacesService: WorkspacesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getWorkspaces();
  }
}
