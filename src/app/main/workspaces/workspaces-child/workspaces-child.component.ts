import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LOGGEDIN_USER } from 'src/app/shared/constants/constants';
import { Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'app-workspaces-child',
  templateUrl: './workspaces-child.component.html',
  styleUrls: ['./workspaces-child.component.css'],
})
export class WorkspacesChildComponent implements OnInit, OnDestroy {
  ownWorkspace!: boolean;
  workspace?: Workspace;

  // subscriptions
  getWorkspaceSubscription?: Subscription;
  routeSubscription!: Subscription;

  /**
   * Get requested workspace.
   *
   * @param workspaceID: string - id of the workspace to be rendered
   */
  getWorkspace(workspaceID: string): void {
    if (!workspaceID) return;

    this.getWorkspaceSubscription = this.workspacesService
      .getWorkspace(workspaceID)
      .subscribe((data: Workspace) => {
        if (data.id) {
          this.workspace = data;
          this.ownWorkspace = data.owner === LOGGEDIN_USER;
        }
      });
  }

  // https://stackoverflow.com/questions/33520043/how-to-detect-a-route-change-in-angular
  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {
    this.routeSubscription = this.route.url.subscribe((url) => {
      this.getWorkspace(url[0].path);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.getWorkspaceSubscription?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
