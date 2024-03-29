import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/models';
import { NAVROUTES } from '../../constants/routes';
import { GenericUtilService } from '../../services/util';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  loggedInUserInitials = '';

  // subscriptions
  loggedInSubscription?: Subscription;
  getUserSubscription!: Subscription;

  // routes
  loginRoute = NAVROUTES.LOGIN;
  calendarRoute = NAVROUTES.CALENDAR;
  workspacesRoute = NAVROUTES.WORKSPACES;

  /**
   * Checks if there is a currently logged in user
   * on first render of app by checking sessionStorage
   */
  authInit(): void {
    const username = sessionStorage.getItem('user');

    if (username) {
      // verify user
      this.authService.getUser(username).subscribe((user: User) => {
        if (user.id) {
          // valid user
          this.loggedInUserInitials = this.genericUtilService.getInitials(
            user.fullName
          );
          this.authService.authInit(username, user.fullName);
          this.isLoggedIn = true;

          // redirect to /workspaces
          if (this.router.url === '/login')
            this.router.navigate(['/workspaces']);
        } else {
          // invalid user
          sessionStorage.clear();
        }
      });
    }
  }

  /**
   * Logs out the user.
   * Resets variables.
   * Redirects to homepage.
   */
  logout(): void {
    this.isLoggedIn = this.authService.logout() !== '';
    this.loggedInUserInitials = '';
    this.router.navigate(['/home']);
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private genericUtilService: GenericUtilService
  ) {
    this.authInit();
  }

  ngOnInit(): void {
    // when user fills out login form then logged in on click
    this.authService.getIsLoggedInEmitter().subscribe(() => {
      this.isLoggedIn = this.authService.loggedInUser !== '';
      if (this.isLoggedIn)
        this.loggedInUserInitials = this.genericUtilService.getInitials(
          this.authService.loggedInFullName
        );
    });
  }

  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe();
    this.loggedInSubscription?.unsubscribe();
  }
}
