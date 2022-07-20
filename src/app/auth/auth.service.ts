import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usersUrl = 'http://localhost:3000/users';

  @Output() fireIsLoggedIn = new EventEmitter();
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  login(): Observable<boolean> {
    window.sessionStorage.setItem('key', 'value');
    return of(true).pipe(
      delay(1000),
      tap(() => (this.isLoggedIn = true))
    );
  }

  logout(): boolean {
    window.sessionStorage.clear();
    this.isLoggedIn = false;
    return this.isLoggedIn;
  }

  // https://www.quora.com/How-do-I-update-a-username-on-Navbar-after-a-user-login-without-refreshing-the-page-with-Angular
  getEmitter() {
    return this.fireIsLoggedIn;
  }

  getUser(username: string): Observable<User> {
    return this.http
      .get<User>(`${this.usersUrl}/${username}`)
      .pipe(catchError(this.handleError<any>({})));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
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
