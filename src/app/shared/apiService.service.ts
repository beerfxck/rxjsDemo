import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrlProfile = 'http://103.13.31.37:17444/api/my/profile';
  private apiUrlTasks = 'http://103.13.31.37:17444/api/tasks';

  constructor(private http: HttpClient) {}

  getProfileData(): Observable<any> {
    return this.http.get(this.apiUrlProfile).pipe(
      catchError(this.handleError),
      map((data: any) => data)
    );
  }

  getTasksData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlTasks).pipe(
      catchError(this.handleError),
      map((data: any) => data)
    );
  }

  getTasksID(id: number): Observable<any> {
    const apiUrlGetTasksId = `http://103.13.31.37:17444/api/tasks/${id}}`;

    return this.http.get(apiUrlGetTasksId).pipe(
      catchError(this.handleError),
      map((data: any) => data)
    );
  }

  getTasksIdBySearch(id: number): Observable<any> {
    const apiUrlGetTasksId = `http://103.13.31.37:17444/api/tasks/${id}}`;

    return this.http.get(apiUrlGetTasksId).pipe(
      catchError(this.handleError),
      map((data: any) => data)
    );
  }


  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
  
