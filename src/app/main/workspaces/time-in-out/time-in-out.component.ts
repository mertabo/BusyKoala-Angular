import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { differenceInSeconds } from 'date-fns';
import { cloneDeep } from 'lodash';
import { AuthService } from 'src/app/auth/auth.service';
import {
  militaryToStandardTimeFormat,
  secondsToDurationString,
} from 'src/app/shared/utils/utils';
import { TIME_SEPARATOR } from '../../../shared/constants/constants';
import { UserTimeData } from '../workspaces';

@Component({
  selector: 'app-time-in-out',
  templateUrl: './time-in-out.component.html',
  styleUrls: ['./time-in-out.component.css'],
})
export class TimeInOutComponent implements OnInit, DoCheck {
  @Input() timeInOutData!: UserTimeData;
  @Input() date!: string;
  @Output() timed = new EventEmitter();
  localTimeInOutData!: UserTimeData;
  loggedInUser = '';
  duration: string = '';
  times: string[][] = [];
  currentlyTimedIn: boolean = false;

  /**
   * Get the time in - time out pairs and append to times[].
   */
  fillTimes(): void {
    this.times = [];

    this.localTimeInOutData.time.forEach((time: string) => {
      let processedTime = time.split(TIME_SEPARATOR);
      if (processedTime.length < 2) {
        processedTime.push('');
        this.currentlyTimedIn = true;
      }
      this.times.push(processedTime);
    });
  }

  /**
   * Handles the action of timing out.
   * Emits an event to notify OtherWorkspace.
   */
  timeOut(): void {
    const timeIn = new Date(
      this.date + ' ' + this.times[this.times.length - 1][0]
    );
    const timeOut = new Date();

    // get duration
    const updatedDuration =
      this.timeInOutData.duration + differenceInSeconds(timeOut, timeIn);

    // get time out in string format
    let time = militaryToStandardTimeFormat(timeOut);

    let updatedTime = this.localTimeInOutData.time;
    updatedTime[updatedTime.length - 1] += ` - ${time}`;

    const updatedUserTimeData: UserTimeData = {
      user: this.loggedInUser,
      time: updatedTime,
      duration: updatedDuration,
    };

    this.currentlyTimedIn = false;
    this.times[this.times.length - 1][1] = time;
    this.timed.emit({ date: timeIn, updatedUserTimeData });
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.duration = secondsToDurationString(this.timeInOutData.duration);
    this.localTimeInOutData = cloneDeep(this.timeInOutData);
    this.loggedInUser = this.authService.loggedInUser;
    this.fillTimes();
  }

  ngDoCheck(): void {
    // check if the object timeInOutData has changed
    if (
      this.localTimeInOutData.time.length !== this.timeInOutData.time.length
    ) {
      this.localTimeInOutData = cloneDeep(this.timeInOutData);
      this.fillTimes();
    }
  }
}
