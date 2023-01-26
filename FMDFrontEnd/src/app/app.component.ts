import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest } from './_models/back-end/login-request.model';
import { UserStatus } from './_models/enums/user-status.model';
import { User } from './_models/back-end/user.model';
import { ApplicationService } from './_services/application.service';
import { HttpService } from './_services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  userNameVerified = false;
  user: User;

  constructor(private applicationSvc: ApplicationService, private http: HttpService) {
    this.applicationSvc.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
  }

  validateUserCNIC(userName: string): Observable<UserStatus> {
    let req = new LoginRequest(userName, '');
    return this.http.post<UserStatus>(environment.api.routes.check_user_cnic, req);
  }

  getUserInfo(cnic: string): Observable<User> {
    return this.http.get(environment.api.routes.user_cnic, { cnic });
  }

}