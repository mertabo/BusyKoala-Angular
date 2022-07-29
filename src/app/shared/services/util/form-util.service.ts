import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtilService {
  constructor() {}

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
  handleFocusOut(formControl: AbstractControl): void {
    if (formControl?.invalid) this.markAsInvalid(formControl);
  }
}
