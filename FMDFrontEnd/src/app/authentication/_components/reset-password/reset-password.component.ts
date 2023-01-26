import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPassword } from 'src/app/_models/back-end/reset-password.model';
import { NotificationStyle } from 'src/app/_models/enums/notification-style.model';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    showMessage = false;
    showCurrentPassword = false;
    incorrectCurrentPassword = false;
    errorMessage = "Sorry! Your token is expired."
    loadForm: boolean = true;
  
    constructor(private notificationSvc: NotificationService,
      private authenticationService: AuthenticationService,
      private router: Router, private formBuilder: FormBuilder) { }
  
    checkOccurance(source: string, searchValue: string, replaceValue: string) {
      if (source.includes(searchValue)) {
        source = source.replace(searchValue, replaceValue);
        return this.checkOccurance(source, searchValue, replaceValue);
      }
      else {
        return source;
      }
    }
  
    ngOnInit() {
      var string_split1 = this.router.url.substr(this.router.url.indexOf("=") + 1);
      var Email = string_split1.substr(0, string_split1.indexOf("."));
      Email = this.checkOccurance(Email, "%3D", "=");
      var resetPassword = new ResetPassword();
      resetPassword.code = string_split1;
      resetPassword.code = this.checkOccurance(resetPassword.code, "%3D", "=");
  
      var encodedCode = resetPassword.code.substr(resetPassword.code.indexOf(".") + 1);
  
      this.loadForm = false;
      if (!(atob(encodedCode) == 'edit')) {
        var a = this.authenticationService.check_link(resetPassword).subscribe(x => {
  
          if (x == "true") {
            this.showMessage = false;
            this.loadForm = true;
          }
          else if (x == 'Your link has expired.') {
            this.notificationSvc.createorUpdateToastNotification('linkExpired ',
              'Oops! Your password recovery token is invalid.', NotificationStyle.danger);
            this.router.navigate([environment.api.routes.signin_user]);
          }
          else {
            this.notificationSvc.createorUpdateToastNotification('error ',
              x, NotificationStyle.danger);
            this.errorMessage = x;
            this.showMessage = true;
          }
        }, error => {
        });
      }
      else {
        this.showCurrentPassword = true;
        this.loadForm = true;
      }
      this.form = this.formBuilder.group({
        email: [atob(Email), [Validators.required, Validators.email]],
        current_password: [{ value: '', disabled: !this.showCurrentPassword }, Validators.required],
        password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\w\\W]{8,}$')]],
        confirm_password: ['', Validators.required]
      }, { validator: this.ConfirmedValidator('password', 'confirm_password') });
    }
  
    ConfirmedValidator(password: string, confirmPassword: string) {
      return (formGroup: FormGroup) => {
        const Password = formGroup.controls[password];
        const ConfirmPassword = formGroup.controls[confirmPassword];
        if (ConfirmPassword.errors && !ConfirmPassword.errors.confirmedValidator) {
          return;
        }
        if (Password.value !== ConfirmPassword.value) {
          ConfirmPassword.setErrors({ confirmedValidator: true });
        } else {
          ConfirmPassword.setErrors(null);
        }
      }
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
      var code = this.router.url.substr(this.router.url.indexOf("=") + 1);
      code = this.checkOccurance(code, "%3D", "=");
      //var token = code.substr(code.indexOf(".") + 1);
      var resetPassword = new ResetPassword();
      //64 bit encoding of password field
      resetPassword.password = btoa(this.f.password.value);
      //Concatinating the 64 bit encoding of email field and code with '.'
      resetPassword.code = code;
      if (this.showCurrentPassword) {
        resetPassword.oldPassword = btoa(this.f.current_password.value);
      }
      this.authenticationService.resetpassword(resetPassword).subscribe(x => {
        if (x == 'Incorrect password.') {
          this.incorrectCurrentPassword = true;
          this.loading = false;
        }
        else if (x == 'Password has been reset.') {
          this.notificationSvc.createorUpdateToastNotification('Reset',
            'Your Password has been reset successfully. Please login again with new password to continue ', NotificationStyle.success);
          if (this.showCurrentPassword) {
            this.authenticationService.logout();
          }
          else {
            this.router.navigate(['auth/login']);
          }
  
        }
  
        else if (x != null) {
          this.errorMessage = x;
          this.incorrectCurrentPassword = false;
          this.showMessage = true;
          this.loading = false;
        }
      }, error => {
  
      });
  
    }
  }
