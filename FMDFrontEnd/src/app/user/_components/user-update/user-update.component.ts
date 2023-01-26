import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/back-end/user.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { UserRoles } from 'src/app/_models/enums/user-roles.model';
import { ApplicationService } from 'src/app/_services/application.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../../authentication/_services/authentication.service';
import { UserService } from '../../_services/user.service';

@Component({
    selector: 'app-user-update',
    templateUrl: './user-update.component.html',
    styleUrls: ['./user-update.component.sass']
})
export class UserUpdateComponent implements OnInit {

    @Input() userRole = UserRoles.User;
    @Output() buttonClicked = new EventEmitter<any>();
    form: FormGroup;
    loading = false;
    submitted = false;
    userNameVerified = false;
    selectedUser: User;
    PhotoFileName: string;
    PhotoFilePath: string;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationSvc: AuthenticationService,
        private notificationSvc: NotificationService,
        private router: Router,
        private applicationSvc: ApplicationService,
        private userSvc: UserService
    ) { }

    NextButton()
    {
        if(this.userRole == UserRoles.Doctor)
            return true;
        else
            return false;
    }

    OnNext()
    {
        this.buttonClicked.emit('Next');
    }
    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            userTitle: ['', Validators.required],
            gender: ['', Validators.required],
            photoFile: ['', Validators.required],
            phoneNo: ['', Validators.required],
            password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\w\\W]{8,}$')]]
        });

        this.applicationSvc.user.subscribe(user => {
            this.selectedUser = user;
            this.f.firstName.setValue(user.firstName);
            this.f.lastName.setValue(user.lastName);
            this.f.email.setValue(user.email);
            this.f.userTitle.setValue(user.userTitle);
            this.f.gender.setValue(user.gender);
            this.f.phoneNo.setValue(user.phoneNo);
            this.f.photoFile.setValue(user.photoFileName);
            this.f.password.setValue(atob(user.password));
            this.PhotoFileName = user.photoFileName;
            this.PhotoFilePath = environment.api.photo_access_url + this.PhotoFileName;
            this.selectedUser = user;
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    public uploadFinished = (event) => {
        this.PhotoFileName = event.dbPath;
        this.f.photoFile.setValue(this.PhotoFileName);
        //this.PhotoFileName = data.body.toString();
        this.PhotoFilePath = environment.api.photo_access_url + this.PhotoFileName;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid)
            return;

        this.loading = true;
        this.selectedUser.firstName = this.f.firstName.value;
        this.selectedUser.lastName = this.f.lastName.value;
        this.selectedUser.userTitle = this.f.userTitle.value;
        this.selectedUser.gender = this.f.gender.value;
        this.selectedUser.phoneNo = this.f.phoneNo.value;
        this.selectedUser.photoFileName = this.PhotoFileName;
        this.selectedUser.password = btoa(this.f.password.value);
        this.userSvc.updateExistingUser(this.selectedUser).subscribe(response => {
            if (response === 'Updated') {
                this.loading = false;
                localStorage.setItem('user', JSON.stringify(this.selectedUser));
                this.notificationSvc.createToastNotification('subscription',
                    'Sucessfully Updated the Existing User Details...',
                    NotificationStyle.success);
            }
            else
                this.notificationSvc.createToastNotification('subscription',
                    'Internal Error Occurs While Updated the Existing User Details...',
                    NotificationStyle.warning);
        }, error => console.log(error));
    }
}