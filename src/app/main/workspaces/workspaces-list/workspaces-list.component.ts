import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WorkspacesService } from '../workspaces.service';
import { Workspace } from '../workspaces';

@Component({
  selector: 'app-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrls: ['./workspaces-list.component.css'],
})
export class WorkspacesListComponent implements OnInit {
  workspaces: Workspace[] = [];
  selectedWorkspace?: Workspace;
  @Output() newWorkspace = new EventEmitter<Workspace>();

  getWorkspaces(): void {
    this.workspacesService.getWorkspaces().subscribe((data: any) => {
      this.workspaces = data;
      if (data) this.selectedWorkspace = data[0];
    });
  }

  selectWorkspace(workspace: Workspace): void {
    this.selectedWorkspace = workspace;
    this.newWorkspace.emit(workspace);
  }

  constructor(private workspacesService: WorkspacesService) {}

  ngOnInit(): void {
    this.getWorkspaces();
  }
}
