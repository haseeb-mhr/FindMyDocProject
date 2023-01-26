import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPassword } from 'src/app/_models/back-end/forgot-password.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { HttpService } from 'src/app/_services/http.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  emailSent: string = '';
  email_sending_error = false;
  email: string = '';

  constructor(private notificationSvc: NotificationService, private authenticationSvc: AuthenticationService, private formBuilder: FormBuilder,
    private router: Router, private http: HttpService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.email)
        this.email = atob(queryParams.email);
      else
        this.email = '';

    });
    this.form = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]]
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    var request = new ForgetPassword();
    request.email = btoa(this.f.email.value);
    var a = this.authenticationSvc.forgotPassword(request).subscribe(response => {
      if (response == "registered") {
        // this.emailSent = "true";
        this.notificationSvc.createorUpdateToastNotification('Reset',
          "We've sent you a link at " + this.f.email.value + '. Please check your email and follow the link to reset your password.', NotificationStyle.success);
        this.loading = true;
        this.router.navigate([environment.api.routes.signin_user]);
      }
      else {
        this.notificationSvc.createorUpdateToastNotification('Reset',
          `Sorry! Your email "${this.f.email.value}" is not registered.`, NotificationStyle.danger);
        this.loading = false;
      }
    }, error => {
    });

  }
} 