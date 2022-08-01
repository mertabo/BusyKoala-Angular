import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginResponse } from 'src/app/shared/models';
import { Subscription } from 'rxjs';
import { FormUtilService } from 'src/app/shared/services/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginSubscription?: Subscription;
  passwordVisible = false;
  validLogin = true;

  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  /**
   * Resets the 'invalid' error of the form controls
   * (that is triggered from submitting invalid credentials)
   * everytime user changes input
   */
  handleChange(): void {
    this.validLogin = true;

    Object.values(this.loginForm.controls).forEach((control) => {
      if (!control.errors?.['required']) {
        control.setErrors(null);
      }
    });
  }

  /**
   * Checks if a required field was touched but not inputted.
   *
   * @param formControlName: string - name of the form control to be checked
   */
  handleFocusOut(formControlName: string): void {
    const formControl = this.loginForm.controls[formControlName];
    if (formControl.errors?.['required']) {
      this.formUtilService.handleFocusOut(formControl);
    } else {
      formControl.setErrors(formControl.errors);
    }
  }

  /**
   * Checks if login form is valid.
   * If valid, verifies user credentials then logs user in if correct.
   */
  login(): void {
    if (this.loginForm.valid) {
      this.loginSubscription = this.authService
        .login(
          this.loginForm.controls['username'].value,
          this.loginForm.controls['password'].value
        )
        .subscribe((loginResponse: LoginResponse) => {
          if (loginResponse.statusCode === 200) {
            // success
            this.authService.fireIsLoggedIn.emit();
            this.router.navigate(['/workspaces']);
          } else {
            this.validLogin = false;

            Object.values(this.loginForm.controls).forEach((control) => {
              control.setErrors({ invalid: true });
            });
          }
        });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.errors?.['required']) {
          this.formUtilService.markAsInvalid(control);
        } else {
          // retains the errors
          control.setErrors(control.errors);
        }
      });
    }
  }

  constructor(
    public authService: AuthService,
    public router: Router,
    private fb: FormBuilder,
    private formUtilService: FormUtilService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
