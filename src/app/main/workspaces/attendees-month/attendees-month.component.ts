import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { secondsToDurationString } from 'src/app/shared/utils/utils';
import { AttendanceMonthlySummary } from '../../../shared/models/workspace.model';

@Component({
  selector: 'app-attendees-month',
  templateUrl: './attendees-month.component.html',
  styleUrls: ['./attendees-month.component.css'],
})
export class AttendeesMonthComponent implements OnInit {
  @Input() monthlySummary?: AttendanceMonthlySummary;
  attendeeNames$: Observable<string>[] = [];
  attendeeDurations: string[] = [];

  /**
   * Get the full name of the user.
   *
   * @param user: string - user/id to be searched
   */
  getFullName(user: string): Observable<string> {
    return this.authService.getUser(user).pipe(map((data) => data.fullName));
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // get the full name of each attendee
    this.monthlySummary?.attendees.forEach((attendee: any) => {
      this.attendeeNames$.push(this.getFullName(attendee.user));
      this.attendeeDurations.push(secondsToDurationString(attendee.duration));
    });
  }
}
