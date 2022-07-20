import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkspacesService } from '../workspaces.service';
import { Workspace } from '../workspaces';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workspaces-list',
  templateUrl: './workspaces-list.component.html',
  styleUrls: ['./workspaces-list.component.css'],
})
export class WorkspacesListComponent implements OnInit, OnDestroy {
  workspaces: Workspace[] = [];
  selectedWorkspaceID?: string;
  routeSubscription!: Subscription;

  getWorkspaces(): void {
    this.workspacesService.getWorkspaces().subscribe((data: any) => {
      this.workspaces = data;

      if (data) {
        this.selectedWorkspaceID = data[0].id;
        this.router.navigate([this.selectedWorkspaceID], {
          relativeTo: this.route,
        });
      }
    });
  }

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
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        // console.log('Route change detected');
      }
      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        this.selectedWorkspaceID = event.url.split('/')[2];
      }
      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar
        // Present error to user
        console.log(event.error);
      }
    });
  }

  ngOnInit(): void {
    this.getWorkspaces();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
