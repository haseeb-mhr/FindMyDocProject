import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../_models/back-end/login-request.model';
import { User } from '../_models/back-end/user.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpService, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(req: LoginRequest) {
    return this.http.post<User>(environment.api.routes.check_login_credential, req)
    .pipe(map(user => {
       localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logOut() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/auth/sign_in']);
    window.location.reload();
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error.error);
  }
}
