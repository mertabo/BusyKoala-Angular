import { Injectable } from '@angular/core';
import { formatDuration, intervalToDuration } from 'date-fns';
import { TIME_SUFFIX } from 'src/app/shared/constants';

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
}
