import { Component, OnInit } from '@angular/core';
import { Workspace } from '../workspaces';
import { LOGGEDIN_USER } from '../../constants/auth';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css'],
})
export class WorkspacesComponent implements OnInit {
  selectedWorkspace?: Workspace;
  ownWorkspace!: boolean;

  selectWorkspace(workspace: Workspace): void {
    this.selectedWorkspace = workspace;
    this.ownWorkspace = workspace.owner === LOGGEDIN_USER;
  }

  constructor() {}

  ngOnInit(): void {}
}
