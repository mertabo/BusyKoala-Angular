import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { WorkspacesService } from '../workspaces.service';
import { Workspace } from 'src/app/shared/models';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/shared/constants';

@Component({
  selector: 'app-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrls: ['./workspaces-list.component.css'],
})
export class WorkspacesListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() newWorkspaceAlert?: Workspace;
  workspaces: Workspace[] = [];
  searchedWorkspaces: Workspace[] = [];
  selectedWorkspaceID?: string;
  hasWorkspaceLoaded = false;
  loggedInUser = '';
  searchFor: string = '';
  prevSearched: string = '';
  searchOptions: string[] = [];
  filteredSearchOptions: string[] = [];

  // subscriptions
  routeSubscription!: Subscription;
  getWorkspacesSubscription!: Subscription;
  deleteWorkspaceSubscription?: Subscription;

  /**
   * Get all workspaces where LOGGEDIN_USER is included.
   */
  getWorkspaces(): void {
    this.getWorkspacesSubscription = this.workspacesService
      .getWorkspaces(this.loggedInUser)
      .subscribe((workspacesResult: any) => {
        this.workspaces = workspacesResult;
        this.searchedWorkspaces = workspacesResult;

        if (workspacesResult) {
          this.selectedWorkspaceID = workspacesResult[0].id; // select the first workspace by default
          // open the first workspace
          this.router.navigate([this.selectedWorkspaceID], {
            relativeTo: this.route,
          });

          // fill in search options for autocomplete
          this.searchOptions = workspacesResult.map(
            (workspace: Workspace) => workspace.name
          );
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

  /**
   * Filter search suggestions while typing.
   */
  filterSuggestions(): void {
    if (this.searchFor) {
      this.filteredSearchOptions = this.searchOptions.filter(
        (option) =>
          option.toLowerCase().indexOf(this.searchFor.toLowerCase()) !== -1
      );
    } else {
      this.filteredSearchOptions = [];
    }
  }

  /**
   * Check if selected workspace is the current loaded workspace or not.
   *
   * @param event: any - holds the value of the selection
   */
  handleSelection(event: any): void {
    if (this.searchFor === event.nzValue) return; // same selection

    this.searchFor = event.nzValue;
    this.search();
  }

  /**
   * Search for a workspace that has the this.searchFor in its name or schedule.
   */
  search(): void {
    // if previously searched
    if (this.searchFor.toLowerCase() === this.prevSearched.toLowerCase())
      return;

    // if no input, reset WorkspacesList
    if (!this.searchFor) {
      this.searchedWorkspaces = this.workspaces;
      this.prevSearched = '';
      return;
    }

    // render the results in UI, filter workspaces
    if (this.filteredSearchOptions.length) {
      this.searchedWorkspaces = this.workspaces.filter((workspace) => {
        return this.filteredSearchOptions.includes(workspace.name);
      });

      this.selectedWorkspaceID = this.searchedWorkspaces[0].id;
    } else {
      this.searchedWorkspaces = [];
      this.selectedWorkspaceID = '.';
    }

    // open the first workspace
    this.router.navigate([this.selectedWorkspaceID], {
      relativeTo: this.route,
    });

    this.prevSearched = this.searchFor;
  }

  /**
   * Delete a workspace.
   *
   * @param workspaceID: string - the id of the workspace to be deleted.
   */
  deleteWorkspace(workspaceID: string): void {
    this.deleteWorkspaceSubscription = this.workspacesService
      .deleteWorkspace(workspaceID)
      .subscribe((res: any) => {
        if (!res.error) {
          this.getWorkspaces();
          this.showNotification(
            true,
            MESSAGE.DELETE_WORKSPACE_SUCCESS_TITLE,
            MESSAGE.DELETE_WORKSPACE_SUCCESS_CONTENT
          );
        } else {
          this.showNotification(
            false,
            MESSAGE.DELETE_WORKSPACE_FAILED_TITLE,
            MESSAGE.DELETE_WORKSPACE_FAILED_CONTENT
          );
        }
      });
  }

  /**
   * Shows notification whether a process was a success or an error.
   *
   * @param status: boolean - true for success, false for error
   * @param title: string - title of the notification
   * @param content: strong - content in the body of the notification
   */
  showNotification(status: boolean, title: string, content: string): void {
    if (status) {
      this.notification.success(title, content, { nzPlacement: 'bottomRight' });
    } else {
      this.notification.error(title, content, { nzPlacement: 'bottomRight' });
    }
  }

  constructor(
    private workspacesService: WorkspacesService,
    private authService: AuthService,
    private notification: NzNotificationService,
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
    this.loggedInUser = this.authService.loggedInUser;

    if (this.loggedInUser) {
      this.getWorkspaces();
    } else {
      this.hasWorkspaceLoaded = true;
    }
  }

  // listen to alerts whenever there is a new workspace
  ngOnChanges(_: SimpleChanges): void {
    if (this.newWorkspaceAlert) {
      this.workspaces.push(this.newWorkspaceAlert!);
    }
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.getWorkspacesSubscription.unsubscribe();
    this.deleteWorkspaceSubscription?.unsubscribe();
  }
}
