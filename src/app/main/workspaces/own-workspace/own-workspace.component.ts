import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-own-workspace',
  templateUrl: './own-workspace.component.html',
  styleUrls: ['./own-workspace.component.css'],
})
export class OwnWorkspaceComponent implements OnInit {
  buttonView = 'today';

  constructor() {}

  ngOnInit(): void {}
}
