import { Injectable } from '@angular/core';
import { formatDuration, intervalToDuration } from 'date-fns';
import { TIME_SUFFIX, WEEKDAYS } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class DateUtilService {
  constructor() {}

  /**
   * Transforms 24hr format of time (Date object) into 12hr format (HH:MM M)
   *
   * @param date: Date - date to be converted
   * @return time: string - the formatted time
   */
  militaryToStandardTimeFormat(date: Date): string {
    let time = '';

    const hours = date.getHours();
    let minutes = `${date.getMinutes()}`;
    if (Number(minutes) < 10) minutes = '0' + minutes; // add 0 for single-digit minutes

    if (hours == 0) {
      // 00:MM
      time += `12:${minutes} AM`;
    } else if (hours == 12) {
      // 12:MM
      time += `12:${minutes} PM`;
    } else if (hours < 12) {
      // < 12:MM
      time += `${hours}:${minutes} AM`;
    } else {
      // > 12:MM
      time += `${hours - 12}:${minutes} PM`;
    }

    return time;
  }

  /**
   * Transforms seconds to duration format (Xh, Xmin, Xs)
   *
   * @param seconds: number - seconds to be converted
   * @return durationString: string - the formatted time
   */
  secondsToDurationString(seconds: number): string {
    let durationString = formatDuration(
      intervalToDuration({ start: 0, end: seconds * 1000 })
    );

    durationString = durationString.replace(/ years?/, TIME_SUFFIX.YEAR);
    durationString = durationString.replace(/ months?/, TIME_SUFFIX.MONTH);
    durationString = durationString.replace(/ days?/, TIME_SUFFIX.DAY);
    durationString = durationString.replace(/ hours?/, TIME_SUFFIX.HOUR);
    durationString = durationString.replace(/ minutes?/, TIME_SUFFIX.MINUTE);
    durationString = durationString.replace(/ seconds?/, TIME_SUFFIX.SECOND);

    return durationString;
  }

  /**
   * Formats the schedule.
   * Sample input: ['', 'Monday', 'Tuesday', '', '', '', 'Saturday']
   * Sample output: Mon-Tue, Sat
   *
   * @param weekArray: string[] - array of weekdays (empty string if weekday is not included)
   * @return schedule: string - the formatted schedule
   */
  generateScheduleString(weekArray: string[]): string {
    let schedule = '';
    let isStart = true;
    let endDay = '';

    weekArray.forEach((day, i) => {
      if (day) {
        const weekday = WEEKDAYS[i].substring(0, 3);

        // first day of a possible daily schedule (e.g. Mon-Fri)
        if (isStart) {
          if (schedule) schedule += ', ';
          schedule += weekday;
          isStart = false;
        } else {
          // store the possible end of a daily schedule
          endDay = weekday;
        }
      } else {
        // if there is an end day, then there is a daily schedule. append end of daily schedule
        if (endDay) schedule += `-${endDay}`;
        isStart = true;
        endDay = '';
      }
    });

    // catches if Sat is part of a daily schedule
    if (endDay) schedule += `-${endDay}`;

    return schedule;
  }
}
