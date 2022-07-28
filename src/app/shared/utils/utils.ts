import { formatDuration, intervalToDuration } from 'date-fns';
import { TIME_SUFFIX, CODE_LENGTH } from '../constants/constants';

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

  durationString = durationString.replace(/ years?/, TIME_SUFFIX.year);
  durationString = durationString.replace(/ months?/, TIME_SUFFIX.month);
  durationString = durationString.replace(/ days?/, TIME_SUFFIX.day);
  durationString = durationString.replace(/ hours?/, TIME_SUFFIX.hour);
  durationString = durationString.replace(/ minutes?/, TIME_SUFFIX.minute);
  durationString = durationString.replace(/ seconds?/, TIME_SUFFIX.second);

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
