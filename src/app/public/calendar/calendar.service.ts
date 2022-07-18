import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  calendarUrl = 'http://localhost:3000/calendar/ericka';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getCalendar(): Observable<any> {
    return this.http
      .get<any>(this.calendarUrl)
      .pipe(
        catchError(this.handleError<any>('getCalendar', { id: '', events: {} }))
      );
  }

  addEvent(event: any): Observable<any> {
    return of(event).pipe(delay(1000));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  constructor(private http: HttpClient) {}
}
