import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Workspace, WorkspacesTotal } from './workspaces';
import { LOGGEDIN_USER } from 'src/app/shared/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class WorkspacesService {
  workspacesUrl = 'http://localhost:3000/workspaces';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /**
   * Get all workspaces where LOGGEDIN_USER is included.
   *
   * @return Observable<Workspace[]> - observable result of the http GET request
   */
  getWorkspaces(): Observable<Workspace[]> {
    return this.http
      .get<Workspace[]>(`${this.workspacesUrl}?q=${LOGGEDIN_USER}`)
      .pipe(catchError(this.handleError<any>([])));
  }

  /**
   * Get the requested workspace.
   *
   * @param id: string - id of the workspace to be searched
   * @return Observable<Workspace> - observable result of the http GET request
   */
  getWorkspace(id: string): Observable<Workspace> {
    return this.http
      .get<Observable<Workspace>>(`${this.workspacesUrl}/${id}`)
      .pipe(catchError(this.handleError<any>({ id: '' })));
  }

  /**
   * Update a workspace.
   *
   * @param updatedWorkspace: Workspace - updated workspace that will replace the old workspace in the db.
   * @return Observable<Workspace> - observable result of the http PUT request
   */
  updateWorkspace(updatedWorkspace: Workspace): Observable<Workspace> {
    return this.http
      .put<Observable<Workspace>>(
        `${this.workspacesUrl}/${updatedWorkspace.id}`,
        updatedWorkspace,
        this.httpOptions
      )
      .pipe(catchError(this.handleError<any>({ id: '' })));
  }

  /**
   * Get the total number of workspaces.
   * For dummy workspace id.
   */
  getWorkspacesTotal(): Observable<WorkspacesTotal> {
    return this.http
      .get<Observable<WorkspacesTotal>>(`${this.workspacesUrl}Total`)
      .pipe(catchError(this.handleError<any>({ total: 23 })));
  }

  /**
   * Update the total number of workspaces.
   * Called when creation of a new workspace is successful.
   *
   * @param updatedWorkspacesTotal: WorkspacesTotal - the updated WorkspacesTotal
   */
  updateWorkspacesTotal(
    updatedWorkspacesTotal: WorkspacesTotal
  ): Observable<WorkspacesTotal> {
    return this.http
      .put<Observable<WorkspacesTotal>>(
        `${this.workspacesUrl}Total`,
        updatedWorkspacesTotal,
        this.httpOptions
      )
      .pipe(catchError(this.handleError<any>({ total: 0 })));
  }

  /**
   * Create a new workspace.
   *
   * @param newWorkspace: Workspace - the new workspace to be added
   */
  createWorkspace(newWorkspace: Workspace): Observable<Workspace> {
    return this.http
      .post<Observable<Workspace>>(
        this.workspacesUrl,
        newWorkspace,
        this.httpOptions
      )
      .pipe(catchError(this.handleError<any>({ id: '' })));
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
