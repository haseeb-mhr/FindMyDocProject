import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/_services/authentication.service';
import { ContactUs } from 'src/app/_models/back-end/contact-us.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.sass']
})
export class ContactUsComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;

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
      personCNIC: ['', [Validators.required, Validators.pattern('^[0-9]{5}-[0-9]{7}-[0-9]$')]],
      contactNumber: ['', [Validators.required, Validators.pattern("^03[0-9]{2} ?[0-9]{7}$")]],
      email: ['', [Validators.required, Validators.email]],
      complainDiscription: ['', Validators.required]
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

    var contactUs = new ContactUs();
    contactUs.firstName = this.f.firstName.value;
    contactUs.lastName = this.f.lastName.value;
    contactUs.contactNo = this.f.contactNumber.value;
    contactUs.email = this.f.email.value;
    contactUs.description = this.f.complainDiscription.value;
    
    var a = this.authenticationSvc.contactUsRequest(contactUs).subscribe(response => {
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
    });
  }
}