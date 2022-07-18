import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css'],
})
export class CreateEventFormComponent implements OnInit {
  @Output() submitted = new EventEmitter<any>();

  createEventForm = this.fb.group({
    title: [null, Validators.required],
    date: [null, Validators.required],
    time: [null],
    workplace: [null],
  });

  markAsInvalid(formControl: AbstractControl): void {
    formControl.markAsDirty();
    formControl.updateValueAndValidity({ onlySelf: true });
  }

  handleFocusOut(formControlName: string): void {
    const formControl = this.createEventForm.controls[formControlName];
    if (formControl.invalid) this.markAsInvalid(formControl);
  }

  submitForm(): void {
    const titleControl = this.createEventForm.controls['title'];
    const dateControl = this.createEventForm.controls['date'];
    const timeControl = this.createEventForm.controls['time'];
    const workplaceControl = this.createEventForm.controls['workplace'];

    if (this.createEventForm.valid) {
      // Event name format: Title (Time @ Workplace)
      let newEvent = titleControl.value;

      if (timeControl.value || workplaceControl.value) {
        newEvent = `${newEvent} (`;

        if (timeControl.value) {
          newEvent = `${newEvent}${formatDate(
            timeControl.value,
            'h:mm a',
            'en-US'
          )}`;

          if (workplaceControl.value) {
            newEvent = `${newEvent} `;
          }
        }

        if (workplaceControl.value) {
          newEvent = `${newEvent}@ ${workplaceControl.value}`;
        }

        newEvent = `${newEvent})`;
      }

      this.submitted.emit({ date: dateControl.value, event: newEvent });
      this.createEventForm.reset();
    } else {
      if (titleControl.invalid) this.markAsInvalid(titleControl);
      if (dateControl.invalid) this.markAsInvalid(dateControl);
    }
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
