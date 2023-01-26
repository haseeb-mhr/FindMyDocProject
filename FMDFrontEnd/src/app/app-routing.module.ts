import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './common-layout/_components/contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorHomeComponent } from './doctor/doctor-home/doctor-home.component';
import { FindMyDoctorComponent } from './find-my-doctor/find-my-doctor.component';
import { AuthGuard } from './_guards/auth.guard';
import { IsAdminGuard } from './_guards/is-admin.guard';

const userModule = () => import('../app/user/user.module').then(x => x.UserModule);
const authenticationModule = () => import('../app/authentication/authentication.module').then(x => x.AuthenticationModule);
const doctorModule = () => import('../app/doctor/doctor.module').then(x => x.DoctorModule);

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'contact_us', component: ContactUsComponent},
  { path: 'find_my_doctor', component: DoctorHomeComponent},
  { path: 'user', loadChildren: userModule, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: authenticationModule },
  { path: 'doctor', loadChildren: doctorModule, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
