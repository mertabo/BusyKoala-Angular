import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LOGGEDIN_USER } from 'src/app/shared/constants/constants';
import { Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'app-workspaces-child',
  templateUrl: './workspaces-child.component.html',
  styleUrls: ['./workspaces-child.component.css'],
})
export class WorkspacesChildComponent implements OnInit {
  ownWorkspace!: boolean;

  getWorkspace(id: string): void {
    this.workspacesService.getWorkspace(id).subscribe((data: Workspace) => {
      this.ownWorkspace = data.owner === LOGGEDIN_USER;
    });
  }

  // https://stackoverflow.com/questions/33520043/how-to-detect-a-route-change-in-angular
  constructor(
    private route: ActivatedRoute,
    private workspacesService: WorkspacesService
  ) {
    this.route.url.subscribe((url) => {
      this.getWorkspace(url[0].path);
    });
  }

  ngOnInit(): void {}
}
