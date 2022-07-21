import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-attendees-month',
  templateUrl: './attendees-month.component.html',
  styleUrls: ['./attendees-month.component.css'],
})
export class AttendeesMonthComponent implements OnInit {
  @Input() data: any;
  attendeeNames$: Observable<string>[] = [];

  getFullName(user: string): Observable<string> {
    return this.authService.getUser(user).pipe(map((data) => data.fullName));
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.data[1].forEach((el: any) => {
      this.attendeeNames$.push(this.getFullName(el.user));
    });
  }
}
