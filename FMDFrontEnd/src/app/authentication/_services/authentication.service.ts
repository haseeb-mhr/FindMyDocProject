import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest } from 'src/app/_models/back-end/login-request.model';
import { User } from 'src/app/_models/back-end/user.model';
import { UserStatus } from 'src/app/_models/enums/user-status.model';
import { HttpService } from 'src/app/_services/http.service';
import { environment } from 'src/environments/environment';
import { ForgetPassword } from 'src/app/_models/back-end/forgot-password.model';
import { ResetPassword } from 'src/app/_models/back-end/reset-password.model';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/_services/notification.service';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { ApplicationService } from 'src/app/_services/application.service';
import { ContactUs } from 'src/app/_models/back-end/contact-us.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpService,
    private applicationSvc: ApplicationService) { }

  validateUserCNIC(userName: string): Observable<UserStatus> {
    let req = new LoginRequest(userName, '');
    return this.http.post<UserStatus>(environment.api.routes.check_user_cnic, req).pipe(
      catchError(error => this.handleError(error))
    );
  }

  generateValidationCode(forgotPassword: ForgetPassword): Observable<UserStatus> {
    return this.http.post(environment.api.routes.generate_validation_code, forgotPassword).pipe(
      catchError(error => this.handleError(error))
    );
  }

  verifyLoginCredential(req: LoginRequest): Observable<User> {
    return this.applicationSvc.login(req);
  }

  createNewUser(user: User) {
    return this.http.post(environment.api.routes.register_user, user).pipe(
      catchError(error => this.handleError(error))
    );
  }

  forgotPassword(forgotPassword: ForgetPassword): Observable<string> {
    return this.http.post(environment.api.routes.forgot_password, forgotPassword).pipe(
      catchError(error => this.handleError(error))
    );
  }

  contactUsRequest(contactUs: ContactUs): Observable<string> {
    return this.http.post(environment.api.routes.contact_us, contactUs).pipe(
      catchError(error => this.handleError(error))
    );
  }

  check_link(email: ResetPassword): Observable<string> {
    return this.http.post(environment.api.routes.check_link, email, 'text');
  }
  resetpassword(resetPassword: ResetPassword): Observable<string> {
    return this.http.post(environment.api.routes.reset_password, resetPassword).pipe(
      catchError(error => this.handleError(error))
    );
  }

  logout() {
    this.applicationSvc.logOut();
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error.error);
  }

}