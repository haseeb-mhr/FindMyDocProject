import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { DoctorProfileComponent } from './doctor-home/doctor-profile/doctor-profile.component';
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';

const routes: Routes = [
  //{ path: '', component: ReportHomeComponent, canActivate: [AuthGuard]},
  { path: 'register', component: DoctorRegisterComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: DoctorProfileComponent, canActivate: [AuthGuard] },
  { path: 'help-line', component: DoctorHomeComponent },
  //{ path: 'delete', component: ReportDeleteComponent, canActivate: [AuthGuard, IsAdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
