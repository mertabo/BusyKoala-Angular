import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/models';
import { secondsToDurationString } from 'src/app/shared/services/util/utils';

@Component({
  selector: 'app-attendees-today',
  templateUrl: './attendees-today.component.html',
  styleUrls: ['./attendees-today.component.css'],
})
export class AttendeesTodayComponent implements OnInit, OnDestroy {
  @Input() attendee: any;
  name?: string;
  duration: string = '';

  // subscriptions
  getFullNameSubscription!: Subscription;

  /**
   * Get the full name of the user.
   */
  getFullName(): void {
    this.getFullNameSubscription = this.authService
      .getUser(this.attendee.user)
      .subscribe((data: User) => {
        this.name = data.fullName;
      });
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getFullName();
    this.duration = secondsToDurationString(this.attendee.duration);
  }

  ngOnDestroy(): void {
    this.getFullNameSubscription.unsubscribe();
  }
}
