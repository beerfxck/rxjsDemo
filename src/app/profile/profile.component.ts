import { Component } from '@angular/core';
import { Observable, Observer, catchError, delay, forkJoin, throwError } from 'rxjs';
import { ApiService } from '../shared/apiService.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profileData$!: Observable<any>;
  tasksData$!: Observable<any[]>;
  tasksIdData$!: Observable<any[]>;

  constructor(private dataService: ApiService) {}

  ngOnInit() {
    this.loadProfileData();
    this.loadTasksData();
    const tasksDataId$: Observer<any> = {
      next: (value: any) => console.log("tasksDataId next", value),
      error: (err: any) => console.log("tasksDataId error", err),
      complete: () => console.log("tasksDataId complete")
    };

    this.tasksIdData$ = this.tripleRequestTask();
    this.tasksIdData$.subscribe(tasksDataId$);
  }

  loadProfileData() {
    this.profileData$ = this.dataService.getProfileData().pipe(
      delay(1000),
      catchError((error) => {
        console.error('Error fetching profile data:', error);
        return throwError(error);
      })
    );
  }

  loadTasksData() {
    this.tasksData$ = this.dataService.getTasksData().pipe(
      delay(1500),
      catchError((error) => {
        console.error('Error fetching tasks data:', error);
        return throwError(error);
      })
    );
  }

  tripleRequestTask() {
    const tasks1$ = this.dataService.getTasksID(1);
    const tasks2$ = this.dataService.getTasksID(2);
    const tasks3$ = this.dataService.getTasksID(3);
    return forkJoin([tasks1$, tasks2$, tasks3$]);
  }
}
