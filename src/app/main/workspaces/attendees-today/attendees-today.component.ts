import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TIME_SEPARATOR } from 'src/app/shared/constants';
import { User } from 'src/app/shared/models';
import { DateUtilService } from 'src/app/shared/services/util';

@Component({
  selector: 'app-attendees-today',
  templateUrl: './attendees-today.component.html',
  styleUrls: ['./attendees-today.component.css'],
})
export class AttendeesTodayComponent implements OnInit, OnDestroy {
  @Input() attendee: any;
  name?: string;
  duration: string = '';
  TIME_SEPARATOR = TIME_SEPARATOR;

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

  constructor(
    private authService: AuthService,
    private dateUtilService: DateUtilService
  ) {}

  ngOnInit(): void {
    this.getFullName();
    this.duration = this.dateUtilService.secondsToDurationString(
      this.attendee.duration
    );
  }

  ngOnDestroy(): void {
    this.getFullNameSubscription.unsubscribe();
  }
}
