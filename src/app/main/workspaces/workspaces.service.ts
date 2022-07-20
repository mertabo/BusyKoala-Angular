import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Workspace } from './workspaces';

@Injectable({
  providedIn: 'root',
})
export class WorkspacesService {
  workspacesUrl = 'http://localhost:3000/workspaces';

  getWorkspaces(): Observable<Workspace[]> {
    return this.http
      .get<any>(this.workspacesUrl)
      .pipe(catchError(this.handleError<any>([])));
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
