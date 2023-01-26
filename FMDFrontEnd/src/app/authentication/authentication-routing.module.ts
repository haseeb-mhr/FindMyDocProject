import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './_components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './_components/reset-password/reset-password.component';
import { SignInComponent } from './_components/sign-in/sign-in.component';
import { SignUpComponent } from './_components/sign-up/sign-up.component';

const routes: Routes = [
  { path: 'sign_in', component: SignInComponent },
  { path: 'sign_up', component: SignUpComponent },
  { path: 'forgot_password', component: ForgotPasswordComponent },
  { path: 'reset_password', component: ResetPasswordComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
