import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Workspace } from 'src/app/shared/models';
import { WorkspacesService } from 'src/app/shared/services/api';
import { MESSAGE, WEEKDAYS } from 'src/app/shared/constants';
import {
  DateUtilService,
  FormUtilService,
  GenericUtilService,
} from 'src/app/shared/services/util';

@Component({
  selector: 'app-add-workspace-modal',
  templateUrl: './add-workspace-modal.component.html',
  styleUrls: ['./add-workspace-modal.component.css'],
})
export class AddWorkspaceModalComponent implements OnInit, OnDestroy {
  @Output() updateWorkspacesList = new EventEmitter<Workspace>();
  loggedInUser = '';
  WEEKDAYS = WEEKDAYS;

  createWorkspaceForm = this.fb.group({
    title: [null, Validators.required],
    schedule: this.fb.array([
      this.fb.control(null),
      this.fb.control(null),
      this.fb.control(null),
      this.fb.control(null),
      this.fb.control(null),
      this.fb.control(null),
      this.fb.control(null),
    ]),
  });

  // subscriptions
  getWorkspacesTotalSubscription?: Subscription;
  updateWorkspacesTotalSubscription?: Subscription;
  createWorkspaceSubscription?: Subscription;

  /**
   * Handles the error checking of a touched form control
   *
   * @param formControlName: string - the name of the form control to be marked
   */
  handleFocusOut(formControlName: string): void {
    const formControl = this.createWorkspaceForm.controls[formControlName];
    this.formUtilService.handleFocusOut(formControl);
  }

  /**
   * Opens a confirmation dialog before creating a workspace.
   */
  confirm(): void {
    const titleControl = this.createWorkspaceForm.controls['title'];

    if (!this.createWorkspaceForm.valid) {
      if (titleControl.invalid)
        this.formUtilService.markAsInvalid(titleControl);
      return;
    }

    this.modal.confirm({
      nzTitle: MESSAGE.CONFIRM_CREATE_WORKSPACE_TITLE,
      nzContent: MESSAGE.CONFIRM_CREATE_WORKSPACE_CONTENT,
      nzOnOk: () => this.createWorkspace(),
    });
  }

  /**
   * Creates a new workspace.
   */
  createWorkspace(): void {
    const tempWeekArr = (
      this.createWorkspaceForm.controls['schedule'] as FormArray
    ).controls.map((control, index) => (control.value ? WEEKDAYS[index] : ''));
    const schedule = this.dateUtilService.generateScheduleString(tempWeekArr);

    // get dummy id
    this.workspacesService.getWorkspacesTotal().subscribe((workspacesTotal) => {
      if (!workspacesTotal.total) return; // error

      // create new workspace object
      const newId = workspacesTotal.total + 1;
      const titleControl = this.createWorkspaceForm.controls['title'];

      const newWorkspace: Workspace = {
        id: newId.toString(),
        ongoing: 'false',
        inviteCode: this.genericUtilService.generateRandomCode(),
        name: titleControl.value,
        owner: this.loggedInUser,
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
    // reset form
    this.createWorkspaceForm.reset();

    // close form
    document.getElementById('buttonClose')?.click();

    // show notification
    this.showNotification(
      true,
      MESSAGE.CREATE_WORKSPACE_SUCCESS_TITLE,
      MESSAGE.CREATE_WORKSPACE_SUCCESS_CONTENT
    );
  }

  /**
   * Prompts user of failed creation.
   */
  creationFail(): void {
    this.showNotification(
      false,
      MESSAGE.CREATE_WORKSPACE_FAILED_TITLE,
      MESSAGE.CREATE_WORKSPACE_FAILED_CONTENT
    );
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
    private fb: FormBuilder,
    private workspacesService: WorkspacesService,
    private authService: AuthService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private dateUtilService: DateUtilService,
    private formUtilService: FormUtilService,
    private genericUtilService: GenericUtilService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
  }

  ngOnDestroy(): void {
    this.getWorkspacesTotalSubscription?.unsubscribe();
    this.updateWorkspacesTotalSubscription?.unsubscribe();
    this.createWorkspaceSubscription?.unsubscribe();
  }
}
