import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LOGGEDIN_USER } from 'src/app/shared/constants/constants';
import { generateRandomCode } from 'src/app/shared/utils/utils';
import { Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'app-add-workspace-modal',
  templateUrl: './add-workspace-modal.component.html',
  styleUrls: ['./add-workspace-modal.component.css'],
})
export class AddWorkspaceModalComponent implements OnInit {
  createWorkspaceForm = this.fb.group({
    title: [null, Validators.required],
    schedule: this.fb.group({
      Sun: [null],
      Mon: [null],
      Tue: [null],
      Wed: [null],
      Thu: [null],
      Fri: [null],
      Sat: [null],
    }),
  });

  markAsInvalid(formControl: AbstractControl): void {
    formControl.markAsDirty();
    formControl.updateValueAndValidity({ onlySelf: true });
  }

  handleFocusOut(formControlName: string): void {
    const formControl = this.createWorkspaceForm.controls[formControlName];
    if (formControl.invalid) this.markAsInvalid(formControl);
  }

  createWorkspace(): void {
    const titleControl = this.createWorkspaceForm.controls['title'];

    if (this.createWorkspaceForm.valid) {
      let schedule = '';
      let isDaily = true;

      Object.keys(
        (this.createWorkspaceForm.controls['schedule'] as FormGroup).controls
      ).forEach((controlName) => {
        if (this.createWorkspaceForm.get(`schedule.${controlName}`)?.value)
          schedule += `${schedule ? ', ' : ''}${controlName}`;
        else isDaily = false;
      });

      if (isDaily) schedule = 'Everyday';
      console.log(schedule);
      const newWorkspace: Workspace = {
        id: '3',
        ongoing: 'false',
        inviteCode: generateRandomCode(),
        name: titleControl.value,
        owner: LOGGEDIN_USER,
        schedule,
        attendance: {},
      };

      console.log(`New workspace: ${newWorkspace}`);
    } else {
      if (titleControl.invalid) this.markAsInvalid(titleControl);
    }
  }

  constructor(
    private fb: FormBuilder,
    private workspacesService: WorkspacesService
  ) {}

  ngOnInit(): void {}
}
