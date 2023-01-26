import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoles } from 'src/app/_models/enums/user-roles.model';
import { UserStatus } from 'src/app/_models/enums/user-status.model';
import { User } from 'src/app/_models/back-end/user.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { ApplicationService } from 'src/app/_services/application.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../../authentication/_services/authentication.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-user-role-update',
  templateUrl: './user-role-update.component.html',
  styleUrls: ['./user-role-update.component.sass']
})
export class UserRoleUpdateComponent implements OnInit {

  userLists: User[];
  usersRoles = ['User', 'Admin'];

  form: FormGroup;
  loading = false;
  selectedUser: User;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationSvc: AuthenticationService,
    private notificationSvc: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private applicationSvc: ApplicationService,
    private userSvc: UserService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: [''], lastName: [''],
      email: [''], username: [''],
      userRole: ['']
    });

    this.applicationSvc.user.subscribe(user => {
      this.userSvc.getAllUsers(user).subscribe(userList => {
        if (userList.length > 0)
          this.userLists = userList;
        else
          this.notificationSvc.createToastNotification('subscription',
            "We don't have any registered User Data...",
            NotificationStyle.warning);
      },
        error => console.log(error)
      );
    });
  }

  getUserRole(userRole: UserRoles) {
    if (userRole == UserRoles.Admin)
      return 'Admin';
    return 'User';
  }

  OnSelection(user: User) {
    this.f.firstName.setValue(user.firstName);
    this.f.lastName.setValue(user.lastName);
    this.f.email.setValue(user.email);
    this.f.username.setValue('cNIC');
    this.f.userRole.setValue(user.userRole);
    this.selectedUser = user;
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.loading = true;
    this.selectedUser.userRole = this.f.userRole.value;
    this.userSvc.updateExistingUser(this.selectedUser).subscribe(response => {
      if (response === 'Updated') {
        this.loading = false;
        this.notificationSvc.createToastNotification('subscription',
          'Sucessfully Updated the Existing User Status...',
          NotificationStyle.success);
      }
      else
        this.notificationSvc.createToastNotification('subscription',
          'Internal Error Occurs While Updated the Existing User Status...',
          NotificationStyle.warning);
    }, error => console.log(error));
  }
}