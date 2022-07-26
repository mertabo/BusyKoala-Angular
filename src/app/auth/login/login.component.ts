import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginResponse } from '../user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  checkedIfLoggedIn = false;
  verifyUserSubscription?: Subscription;
  loginSubscription?: Subscription;

  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
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
    const formControl = this.loginForm.controls[formControlName];
    if (formControl?.invalid) this.markAsInvalid(formControl);
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
            const redirectUrl = '/workspaces';

            // Set our navigation extras object
            // that passes on our global query params and fragment
            const navigationExtras: NavigationExtras = {
              queryParamsHandling: 'preserve',
              preserveFragment: true,
            };

            // Redirect the user
            this.authService.fireIsLoggedIn.emit();
            this.router.navigate([redirectUrl], navigationExtras);
          } else if (loginResponse.statusCode === 401) {
            // incorrect password
            this.loginForm.controls['password'].setErrors({
              incorrectPW: true,
            });
          } else {
            // 404: user not found
            this.loginForm.controls['username'].setErrors({
              userNotFound: true,
            });
          }
        });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          this.markAsInvalid(control);
        }
      });
    }
  }

  constructor(
    public authService: AuthService,
    public router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const loggedSession = sessionStorage.getItem('user');

    if (!loggedSession) this.checkedIfLoggedIn = true;
    else {
      this.verifyUserSubscription = this.authService
        .getUser(loggedSession)
        .subscribe((user) => {
          if (!user.id) {
            this.checkedIfLoggedIn = true;
            sessionStorage.clear();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.verifyUserSubscription?.unsubscribe();
    this.loginSubscription?.unsubscribe();
  }
}
