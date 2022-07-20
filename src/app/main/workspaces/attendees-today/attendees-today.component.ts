import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-attendees-today',
  templateUrl: './attendees-today.component.html',
  styleUrls: ['./attendees-today.component.css'],
})
export class AttendeesTodayComponent implements OnInit {
  @Input() attendee: any;
  name?: string;

  getUser(): void {
    this.authService.getUser(this.attendee.user).subscribe((data: User) => {
      this.name = data.fullName;
    });
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUser();
  }
}
