import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { LOGGEDIN_USER } from 'src/app/shared/constants/constants';
import { generateRandomCode } from 'src/app/shared/utils/utils';
import { Workspace } from '../workspaces';
import { WorkspacesService } from '../workspaces.service';

@Component({
  selector: 'app-add-workspace-modal',
  templateUrl: './add-workspace-modal.component.html',
  styleUrls: ['./add-workspace-modal.component.css'],
})
export class AddWorkspaceModalComponent implements OnInit, OnDestroy {
  @Output() updateWorkspacesList = new EventEmitter<Workspace>();

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

  // subscriptions
  getWorkspacesTotalSubscription?: Subscription;
  updateWorkspacesTotalSubscription?: Subscription;
  createWorkspaceSubscription?: Subscription;

  /**
   * Marks a form control as invalid and shows error.
   *
   * @param formControl: AbstractControl - the form control to be marked
   */
  markAsInvalid(formControl: AbstractControl): void {
    formControl.markAsDirty();
    formControl.updateValueAndValidity({ onlySelf: true });
  }

  /**
   * Handles the error checking of a touched form control
   *
   * @param formControlName: string - the name of the form control to be marked
   */
  handleFocusOut(formControlName: string): void {
    const formControl = this.createWorkspaceForm.controls[formControlName];
    if (formControl.invalid) this.markAsInvalid(formControl);
  }

  /**
   * Creates a new workspace.
   */
  createWorkspace(): void {
    const titleControl = this.createWorkspaceForm.controls['title'];

    if (!this.createWorkspaceForm.valid) {
      if (titleControl.invalid) this.markAsInvalid(titleControl);
      return;
    }

    let schedule = '';
    let isStart = true;
    let endDay = '';

    // get the string of schedule
    Object.keys(
      (this.createWorkspaceForm.controls['schedule'] as FormGroup).controls
    ).forEach((controlName) => {
      if (this.createWorkspaceForm.get(`schedule.${controlName}`)?.value) {
        // checked
        // first day of a possible daily schedule (e.g. Mon-Fri)
        if (isStart) {
          if (schedule) schedule += ', ';
          schedule += controlName;
          isStart = false;
        } else {
          // store the possible end of a daily schedule
          endDay = controlName;
        }
      } else {
        // unchecked
        // if there is an end day, then there is a daily schedule. append end of daily schedule
        if (endDay) schedule += `-${endDay}`;
        isStart = true;
        endDay = '';
      }
    });

    // catches if Sat is part of a daily schedule
    if (endDay) schedule += `-${endDay}`;

    // get dummy id
    this.workspacesService.getWorkspacesTotal().subscribe((workspacesTotal) => {
      if (!workspacesTotal.total) return; // error

      // create new workspace object
      const newId = workspacesTotal.total + 1;
      const newWorkspace: Workspace = {
        id: newId.toString(),
        ongoing: 'false',
        inviteCode: generateRandomCode(),
        name: titleControl.value,
        owner: LOGGEDIN_USER,
        schedule,
        attendance: {},
      };

      // update dummy id
      this.workspacesService
        .updateWorkspacesTotal({
          total: newId,
        })
        .subscribe((newWorkspacesTotal) => {
          if (newWorkspacesTotal.total === newId) {
            // create workspace
            this.workspacesService
              .createWorkspace(newWorkspace)
              .subscribe((workspaceResult) => {
                if (workspaceResult.id) {
                  this.creationSuccess(workspaceResult);
                } else {
                  this.creationFail();
                }
              });
          } else {
            this.creationFail();
          }
        });
    });
  }

  /**
   * Prompts user of creation and updates UI.
   */
  creationSuccess(newWorkspace: Workspace): void {
    this.updateWorkspacesList.emit(newWorkspace);
    console.log('creation success');
  }

  /**
   * Prompts user of failed creation.
   */
  creationFail(): void {
    console.log('error creating');
  }

  constructor(
    private fb: FormBuilder,
    private workspacesService: WorkspacesService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.getWorkspacesTotalSubscription?.unsubscribe();
    this.updateWorkspacesTotalSubscription?.unsubscribe();
    this.createWorkspaceSubscription?.unsubscribe();
  }
}
