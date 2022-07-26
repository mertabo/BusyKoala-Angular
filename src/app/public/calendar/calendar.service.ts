import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Calendar } from './calendar';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  calendarUrl = 'http://localhost:3000/calendar';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /**
   * Get calendar of the user.
   *
   * @param username: string - username of the owner of the calendar
   * @return Observable<Calendar> - observable result of the http GET request
   */
  getCalendar(username: string): Observable<Calendar> {
    return this.http
      .get<Calendar>(`${this.calendarUrl}/${username}`)
      .pipe(catchError(this.handleError<any>({ id: '', events: {} })));
  }

  /**
   * Create calendar for the user
   *
   * @param newCalendar: Calendar - holds the data of the new calendar
   * @return Observable<Calendar> - observable result of the http POST request
   */
  createCalendar(newCalendar: Calendar): Observable<Calendar> {
    return this.http
      .post<Calendar>(this.calendarUrl, newCalendar, this.httpOptions)
      .pipe(catchError(this.handleError<any>({ id: '', events: {} })));
  }

  /**
   * Create event by updating the calendar.
   *
   * @param updatedCalendar: Calendar - new calendar that will replace the calendar in the db.
   * @return Observable<Calendar> - observable result of the http PUT request
   */
  addEvent(updatedCalendar: Calendar): Observable<Calendar> {
    return this.http
      .put<Calendar>(
        `${this.calendarUrl}/${updatedCalendar.id}`,
        updatedCalendar,
        this.httpOptions
      )
      .pipe(catchError(this.handleError<any>({ id: '', events: {} })));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  constructor(private http: HttpClient) {}
}
