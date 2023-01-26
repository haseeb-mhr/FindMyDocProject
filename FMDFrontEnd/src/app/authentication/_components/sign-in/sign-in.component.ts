import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequest } from 'src/app/_models/back-end/login-request.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { UserStatus } from 'src/app/_models/enums/user-status.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  emailVerified = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationSvc: AuthenticationService,
    private notificationSvc: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\w\\W]{8,}$')]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onEmailInputChange() {
    let email = this.f.email.value;
    this.authenticationSvc.validateUserCNIC(email).subscribe(response => {
      if (response === UserStatus.EmailExists) {
        this.emailVerified = true;
      }
      else {
        this.notificationSvc.createToastNotification('subscription',
          'We can not find any User against given Email...',
          NotificationStyle.warning);
      }
    },
      error => console.log(error)
    );
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    if (this.emailVerified) {
      this.loading = true;
      let req = new LoginRequest(this.f.email.value, btoa(this.f.password.value));

      this.authenticationSvc.verifyLoginCredential(req)
        .pipe(first())
        .subscribe({
          next: () => {
            this.loading = false;
            this.notificationSvc.createToastNotification('subscription',
              'You have Sucessfully Sign In At Find My Doctor...',
              NotificationStyle.success);
          },
          error: error => {
            this.notificationSvc.createToastNotification('subscription',
              'Sorry! You are Unable to Sign In At Find My Doctor...',
              NotificationStyle.warning);
            this.loading = false;
          }
        });
    }
  }
}