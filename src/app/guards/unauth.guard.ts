import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnauthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): Observable<boolean> | boolean {
    const loggedSession = sessionStorage.getItem('user');

    if (!loggedSession) return true;

    return this.authService.getUser(loggedSession).pipe(
      map((user) => {
        if (!user.id) {
          sessionStorage.clear();
          return true;
        }

        this.router.navigate(['/workspaces']);
        return false;
      })
    );
  }

  constructor(private authService: AuthService, private router: Router) {}
}
