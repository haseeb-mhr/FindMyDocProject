import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DoctorLocation } from 'src/app/_models/back-end/doctor-location.model';
import { DoctorQualification } from 'src/app/_models/back-end/doctor-qualification.model';
import { DoctorSpecialization } from 'src/app/_models/back-end/doctor-specialization.model';
import { User } from 'src/app/_models/back-end/user.model';
import { HttpService } from 'src/app/_services/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpService) { }

  getAllUsers(user: User): Observable<User[]> {
    return this.http.get(environment.api.routes.get_all_users, user).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateExistingUser(user: User) {
    return this.http.put(environment.api.routes.update_user, user).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updatePracticeLocation(user: DoctorLocation) {
    return this.http.put(environment.api.routes.update_doctor_location, user).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateQualification(user: DoctorQualification) {
    return this.http.put(environment.api.routes.update_doctor_qualification, user).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updateSpecialization(user: DoctorSpecialization) {
    return this.http.put(environment.api.routes.update_doctor_specialization, user).pipe(
      catchError(error => this.handleError(error))
    );
  }
  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error.error);
  }
}
