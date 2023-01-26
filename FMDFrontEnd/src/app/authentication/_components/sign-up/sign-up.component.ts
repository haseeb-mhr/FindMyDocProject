import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPassword } from 'src/app/_models/back-end/forgot-password.model';
import { UserStatus } from 'src/app/_models/enums/user-status.model';
import { User } from 'src/app/_models/back-end/user.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../_services/authentication.service';
import { Genders } from 'src/app/_models/enums/user-gender.model';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    userNameVerified = false;
    validationCodeGenerated = true;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationSvc: AuthenticationService,
        private notificationSvc: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            userTitle: ['', Validators.required],
            gender: ['Male', Validators.required],
            phoneNo: ['', Validators.required],
            password: ['4Islambad', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\w\\W]{8,}$')]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onEmailInputChange() {
        let email = this.f.email.value;
        this.authenticationSvc.validateUserCNIC(email).subscribe(response => {
            if (response !== UserStatus.EmailExists) {
                this.userNameVerified = true;
                this.GenarateValidationCode();
            }
            else {
                this.userNameVerified = false;
                this.notificationSvc.createToastNotification('subscription',
                    'User Already Exists against given Email...',
                    NotificationStyle.warning);
            }
        },
            error => console.log(error)
        );
    }

    GenarateValidationCode() {
        if (this.f.email.invalid) {
            this.notificationSvc.createToastNotification('email',
                'Email must be provided to generate Verification code...',
                NotificationStyle.warning);
            return;
        }
        var req = new ForgetPassword();
        req.email = this.f.email.value;
        this.authenticationSvc.generateValidationCode(req).subscribe(response => {
            if (response) {
                this.validationCodeGenerated = true;
                this.notificationSvc.createToastNotification('subscription',
                    'An Email has been sent to ' + req.email + ' containing Varification Code...',
                    NotificationStyle.success);
            }
        },
            error => {
                this.notificationSvc.createToastNotification('subscription',
                    'An Error occur while genarating Code. Please Re-Check Your email...',
                    NotificationStyle.success);
            }
        );
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        if (this.userNameVerified) {

            if (this.validationCodeGenerated) {
                this.loading = true;
                let user = new User(
                    this.f.email.value,
                    //  + '&' + this.f.validationCode.value
                    this.f.firstName.value,
                    this.f.lastName.value,
                    this.f.userTitle.value,
                    this.f.gender.value,
                    this.f.phoneNo.value,
                    btoa(this.f.password.value));
                this.authenticationSvc.createNewUser(user).subscribe(user => {
                    if (user) {
                        this.loading = false;
                        this.router.navigate([environment.api.routes.signin_user]);

                        this.notificationSvc.createToastNotification('subscription',
                            'You have Sucessfully Sign Up At Find My Doctor...',
                            NotificationStyle.success);
                    }
                    else {
                        this.notificationSvc.createToastNotification('subscription',
                            'Sorry! You are Unable to Sign Up At Find My Doctor...',
                            NotificationStyle.danger);
                    }
                },
                    error => {
                        this.notificationSvc.createToastNotification('subscription',
                            'An Error occur while registing User. ' + error?.Message,
                            NotificationStyle.danger);
                    }
                );
            }
            else
                this.notificationSvc.createToastNotification('subscription',
                    'Please provide Verification code to proceed...',
                    NotificationStyle.danger);
        }
        else
            this.notificationSvc.createToastNotification('subscription',
                'Please provide unique CNIC to Register User...',
                NotificationStyle.danger);
    }
}