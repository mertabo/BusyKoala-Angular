import { EventEmitter, Injectable, Output } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  getEmitter() {
    return this.fireIsLoggedIn;
  }
}
