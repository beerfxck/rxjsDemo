import { Component } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from '../apiService.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profileData$!: Observable<any>;
  tasksData$!: Observable<any[]>;

  constructor(private dataService: ApiService) {}

  ngOnInit() {
    this.loadProfileData();
    this.loadTasksData();
  }

  loadProfileData() {
    this.profileData$ = this.dataService.getProfileData().pipe(
      catchError((error) => {
        console.error('Error fetching profile data:', error);
        return throwError(error);
      })
    );
  }

  loadTasksData() {
    this.tasksData$ = this.dataService.getTasksData().pipe(
      catchError((error) => {
        console.error('Error fetching tasks data:', error);
        return throwError(error);
      })
    );
  }
}
