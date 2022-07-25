import { Component, OnInit } from '@angular/core';
import { Workspace } from '../workspaces';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css'],
})
export class WorkspacesComponent implements OnInit {
  newWorkspaceAlert?: Workspace;

  // gets notified whenever there is new workspace creation in AddWorkspaceModal
  // alerts WorkspacesList of the new workspace
  updateWorkspacesList(newWorkspace: Workspace) {
    this.newWorkspaceAlert = newWorkspace;
  }

  constructor() {}

  ngOnInit(): void {}
}
