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
import { CalendarEvent } from '../calendar';

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
   * Marks a form control invalid.
   * Shows error in UI.
   *
   * @param formControl: AbstractControl - form control to be marked
   */
  markAsInvalid(formControl: AbstractControl): void {
    formControl.markAsDirty();
    formControl.updateValueAndValidity({ onlySelf: true });
  }

  /**
   * Checks if a required field was touched but not inputted.
   *
   * @param formControlName: string - name of the form control to be checked
   */
  handleFocusOut(formControlName: string): void {
    const formControl = this.createEventForm.controls[formControlName];
    if (formControl?.invalid) this.markAsInvalid(formControl);
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

    if (this.createEventForm.valid) {
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
    } else {
      if (titleControl.invalid) this.markAsInvalid(titleControl);
      if (dateControl.invalid) this.markAsInvalid(dateControl);
    }
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges(_: SimpleChanges): void {
    if (this.successfulRequest) this.createEventForm.reset();
  }
}
