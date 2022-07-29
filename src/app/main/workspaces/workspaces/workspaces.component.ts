import { Component } from '@angular/core';
import { Workspace } from 'src/app/shared/models';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css'],
})
export class WorkspacesComponent {
  newWorkspaceAlert?: Workspace;

  /**
   * Gets notified whenever there is new workspace creation in AddWorkspaceModal.
   * Alerts WorkspacesList of the new workspace.
   *
   * @param newWorkspace: Workspace = an object of the new workspace created
   */
  updateWorkspacesList(newWorkspace: Workspace) {
    this.newWorkspaceAlert = newWorkspace;
  }
}
