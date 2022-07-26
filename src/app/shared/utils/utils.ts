import { formatDuration, intervalToDuration } from 'date-fns';
import { AGE_SUFFIX, CODE_LENGTH } from '../constants/constants';

/**
 * Transforms 24hr format of time (Date object) into 12hr format (HH:MM M)
 *
 * @param date: Date - date to be converted
 * @return time: string - the formatted time
 */
export function militaryToStandardTimeFormat(date: Date): string {
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
 * Transforms seconds to duration format (X hr, X min, X sec)
 *
 * @param seconds: number - seconds to be converted
 * @return durationString: string - the formatted time
 */
export function secondsToDurationString(seconds: number): string {
  let durationString = formatDuration(
    intervalToDuration({ start: 0, end: seconds * 1000 })
  );

  // AGE_SUFFIX = ['y', 'm', 'd', 'h', 'm', 's'];
  durationString = durationString.replace(/ years?/, AGE_SUFFIX[0]);
  durationString = durationString.replace(/ months?/, AGE_SUFFIX[1]);
  durationString = durationString.replace(/ days?/, AGE_SUFFIX[2]);
  durationString = durationString.replace(/ hours?/, AGE_SUFFIX[3]);
  durationString = durationString.replace(/ minutes?/, AGE_SUFFIX[4]);
  durationString = durationString.replace(/ seconds?/, AGE_SUFFIX[5]);

  return durationString;
}

/**
 * Generates a random string of size CODE_LENGTH
 *
 * @return code: string - the randomized code
 */
export function generateRandomCode(): string {
  let code = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;

  for (let i = 0; i < CODE_LENGTH; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return code;
}
