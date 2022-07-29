import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponse, User } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usersUrl = 'http://localhost:3000/users';

  @Output() fireIsLoggedIn = new EventEmitter();
  @Output() fireCheckedIfLoggedIn = new EventEmitter();
  loggedInFullName = ''; // full name
  loggedInUser = ''; // username

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  /**
   * Called by NavbarComponent.
   * Sets loggedInUser if there is an ongoing logged in session after refresh.
   */
  authInit(username: string, fullName: string) {
    this.loggedInFullName = fullName;
    this.loggedInUser = username;
  }

  /**
   * Returns the data of user being requested.
   *
   * @param username: string - username of the user to get
   * @return Observable<User> - an observable object of the user
   */
  getUser(username: string): Observable<User> {
    return this.http
      .get<User>(`${this.usersUrl}/${username}`)
      .pipe(catchError(this.handleError<any>({ id: '' })));
  }

  /**
   * Logs the user in after validation.
   * Sets details to session storage.
   *
   * @return Observable<LoginResponse> - response of the log in
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.getUser(username).pipe(
      map((user) => {
        if (user.id) {
          // check if correct password
          if (user.password !== password) {
            return {
              statusCode: 401,
              user: user,
            };
          }

          // success
          window.sessionStorage.setItem('user', username);
          this.loggedInFullName = user.fullName;
          this.loggedInUser = username;

          return {
            statusCode: 200,
            user: user,
          };
        } else {
          // user not found
          return {
            statusCode: 404,
            user: user,
          };
        }
      })
    );
  }

  /**
   * Logs the user out.
   * Clears the details from session storage.
   *
   * @return string - empty if logged out, Full Name of user if logged in
   */
  logout(): string {
    window.sessionStorage.clear();
    this.loggedInFullName = '';
    this.loggedInUser = '';
    return this.loggedInUser;
  }

  /**
   * Used to notify the navbar of the log in.
   */
  // https://www.quora.com/How-do-I-update-a-username-on-Navbar-after-a-user-login-without-refreshing-the-page-with-Angular
  getIsLoggedInEmitter(): EventEmitter<boolean> {
    return this.fireIsLoggedIn;
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
