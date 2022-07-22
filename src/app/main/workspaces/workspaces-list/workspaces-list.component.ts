import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { WorkspacesService } from '../workspaces.service';
import { Workspace } from '../workspaces';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { LOGGEDIN_USER } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrls: ['./workspaces-list.component.css'],
})
export class WorkspacesListComponent implements OnInit, OnDestroy {
  workspaces: Workspace[] = [];
  selectedWorkspaceID?: string;
  hasWorkspaceLoaded = false;
  LOGGEDIN_USER = LOGGEDIN_USER;

  // subscriptions
  routeSubscription!: Subscription;
  getWorkspacesSubscription!: Subscription;

  /**
   * Get all workspaces where LOGGEDIN_USER is included.
   */
  getWorkspaces(): void {
    this.getWorkspacesSubscription = this.workspacesService
      .getWorkspaces()
      .subscribe((data: any) => {
        this.workspaces = data;

        if (data) {
          this.selectedWorkspaceID = data[0].id; // select the first workspace by default
          // listen to route changes to update the sidebar accordingly
          this.router.navigate([this.selectedWorkspaceID], {
            relativeTo: this.route,
          });
        }
        this.hasWorkspaceLoaded = true;
      });
  }

  /**
   * Update selectedWorkspaceID everytime a workspace is clicked.
   *
   * @param workspaceID: string - id of the workspace that was selected
   */
  selectWorkspace(workspaceID: string): void {
    this.selectedWorkspaceID = workspaceID;
  }

  constructor(
    private workspacesService: WorkspacesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // https://www.angularjswiki.com/angular/how-to-detect-route-change-in-angular-with-examples/
    this.routeSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let tempIDArr = event.url.split('/');
        if (tempIDArr.length > 1) {
          this.selectedWorkspaceID = tempIDArr[2];
        }
      }
      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }

  ngOnInit(): void {
    this.getWorkspaces();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.getWorkspacesSubscription.unsubscribe();
  }
}
