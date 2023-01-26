import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Doctor } from 'src/app/_models/back-end/doctor.model';
import { HttpService } from 'src/app/_services/http.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private http: HttpService, private router: Router,
    private notificationSvc: NotificationService) { }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get(environment.api.routes.get_all_doctors).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error.error);
  }
}