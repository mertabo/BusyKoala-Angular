export function militaryToStandardTimeFormat(date: Date): string {
  let time = '';

  const hours = date.getHours();
  let minutes = `${date.getMinutes()}`;
  if (Number(minutes) < 10) minutes = '0' + minutes;

  if (hours == 12) {
    time += `12:${minutes} AM`;
  } else if (hours <= 12) {
    time += `${hours}:${minutes} AM`;
  } else {
    time += `${hours - 12}:${minutes} PM`;
  }

  return time;
}
