import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CalendarEvent } from 'src/app/shared/models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/shared/constants';
import { FormUtilService } from 'src/app/shared/services/util/form-util.service';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css'],
})
export class CreateEventFormComponent implements OnInit, OnChanges {
  @Input() isProcessingRequest: boolean = false;
  @Input() successfulRequest: boolean = false;
  @Output() submitted = new EventEmitter<any>();

  createEventForm = this.fb.group({
    title: [null, Validators.required],
    date: [null, Validators.required],
    time: [null],
    workplace: [null],
  });

  /**
   * Checks if a required field was touched but not inputted.
   *
   * @param formControlName: string - name of the form control to be checked
   */
  handleFocusOut(formControlName: string): void {
    const formControl = this.createEventForm.controls[formControlName];
    this.formUtilService.handleFocusOut(formControl);
  }

  /**
   * Opens a confirmation dialog before creating an event.
   */
  confirmCreate(): void {
    if (this.createEventForm.valid) {
      this.modal.confirm({
        nzTitle: MESSAGE.CONFIRM_CREATE_EVENT_TITLE,
        nzContent: MESSAGE.CONFIRM_CREATE_EVENT_CONTENT,
        nzOnOk: () => this.submitForm(),
      });
    } else {
      const titleControl = this.createEventForm.controls['title'];
      const dateControl = this.createEventForm.controls['date'];

      if (titleControl.invalid)
        this.formUtilService.markAsInvalid(titleControl);
      if (dateControl.invalid) this.formUtilService.markAsInvalid(dateControl);
    }
  }

  /**
   * Submits the form that contains details about the new event.
   * Triggers the CalendarComponent to communicate with the server.
   */
  submitForm(): void {
    const titleControl = this.createEventForm.controls['title'];
    const dateControl = this.createEventForm.controls['date'];
    const timeControl = this.createEventForm.controls['time'];
    const workplaceControl = this.createEventForm.controls['workplace'];

    // event name format: Title (Time @ Workplace)
    const newEventDetails: CalendarEvent = {
      title: titleControl.value,
      time: '',
      workplace: '',
    };

    if (timeControl.value)
      newEventDetails.time = formatDate(timeControl.value, 'h:mm a', 'en-US');
    if (workplaceControl.value)
      newEventDetails.workplace = workplaceControl.value;

    const newEvent = {
      date: dateControl.value,
      event: newEventDetails,
    };

    this.submitted.emit(newEvent);
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private formUtilService: FormUtilService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(_: SimpleChanges): void {
    if (this.successfulRequest) this.createEventForm.reset();
  }
}
