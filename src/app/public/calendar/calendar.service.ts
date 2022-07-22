import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Calendar } from './calendar';
import { LOGGEDIN_USER } from 'src/app/shared/constants/constants';

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
   * Create event by updating the calendar.
   * Can only get calendar with ericka id only since auth is not yet fully implemented.
   *
   * @return Observable<Calendar> - observable result of the http GET request
   */
  getCalendar(): Observable<Calendar> {
    return this.http
      .get<Calendar>(`${this.calendarUrl}/${LOGGEDIN_USER}`)
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
