import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/back-end/user.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { ApplicationService } from 'src/app/_services/application.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  user: User;
  userExists = false;
  isAdmin = false;
  constructor(private applicationSvc: ApplicationService,
    private notificationSvc: NotificationService,
    private router: Router) { }

  ngOnInit(): void {

    this.applicationSvc.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.userExists = true;
        if (user.userRole == 1) {
          this.isAdmin = true;
        }
      }
    })
  }

  logOut() {
    this.applicationSvc.logOut();
    this.router.navigate([environment.server_url + '/#']);
    this.notificationSvc.createToastNotification('subscription',
      'You have bee Sign Out from Find My Doctor...',
      NotificationStyle.success);
  }

}
