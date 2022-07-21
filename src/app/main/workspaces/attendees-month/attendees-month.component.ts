import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-attendees-month',
  templateUrl: './attendees-month.component.html',
  styleUrls: ['./attendees-month.component.css'],
})
export class AttendeesMonthComponent implements OnInit {
  @Input() data: any;
  $try!: Observable<User>;

  getFullName(user: string) {
    // return of('ok');
    this.$try = this.authService
      .getUser(user)
      .pipe(tap((data) => data.fullName));
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
