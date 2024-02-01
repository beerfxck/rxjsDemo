import { Component } from '@angular/core';
import { Observable, Observer, Subject, Subscription, catchError, debounce, debounceTime, delay, forkJoin, of, switchMap, tap, throwError } from 'rxjs';
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
  
  tasksIdBySearchData$!: Observable<any>;
  onSearchTask = new Subject<number>();

  // constructor(private dataService: ApiService) {
  //   this.onSearchTask.pipe(
  //     debounceTime(500),
  //     switchMap((searchTaskId) => {
  //       return this.dataService.getTasksIdBySearch(searchTaskId);
  //     })
  //   )
  //     .subscribe((value) =>(this.tasksIdBySearchData$ = value)
  //       // if (Array.isArray(value)) {
  //       //   this.tasksIdBySearchData$ = of(value);
  //       // } else if (typeof value === 'object' && value !== null) {
  //       //   this.tasksIdBySearchData$ = of([value]);
  //       // } else {
  //       //   console.error('Invalid data returned:', value);
  //       // }
  //     );
  // }

  constructor(private dataService: ApiService) {
    this.onSearchTask.pipe(
      debounceTime(500),
      switchMap((searchTaskId) => {
        return this.dataService.getTasksID(searchTaskId);
      })
    )
      .subscribe((value) => {
        if (typeof value == 'object' ) {
          this.tasksIdBySearchData$ = of(value);
        } else {
          console.error(value);
        }
      });
  }

  ngOnInit() {
    this.loadProfileData();
    this.loadTasksData();
    
    this.tripleRequestTask();
  }

  loadProfileData() {
    this.profileData$ = this.dataService.getProfileData().pipe(
      tap(value => console.log("ค่าของ Profile เป็น:" + value.avatar)),
      delay(1000),
      catchError((error) => {
        console.error('Error fetching profile data:', error);
        return throwError(error);
      })
    );
  }

  loadTasksData() {
    this.tasksData$ = this.dataService.getTasksData().pipe(
      tap(value => console.log("ค่าจาก Task เป็น:" + value)),
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

    this.tasksIdData$ = forkJoin([tasks1$, tasks2$, tasks3$]);
  }

  searchId(searchTaskId: string): void {
    const taskIdAsNumber: number = Number(searchTaskId);
    this.onSearchTask.next(taskIdAsNumber);
  }

  tap(fn: (value: any) => void) {
    return (source: Observable<any>) =>
      new Observable(observer => {
        console.log("subscribe!");
        const subscription = source.subscribe({
          next: (value: any) => {
            // side effect
            fn(value);
            observer.next(value);
          },
          error: err => {
            observer.error(err);
          },
          complete: () => {
            observer.complete();
          }
        });

        return () => {
          console.log("unsubscribe!");
          subscription.unsubscribe();
        };
      });
  }
}
