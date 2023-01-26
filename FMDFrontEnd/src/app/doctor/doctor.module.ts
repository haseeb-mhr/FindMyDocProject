import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { UserModule } from '../user/user.module';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { DoctorProfileComponent } from './doctor-home/doctor-profile/doctor-profile.component';


@NgModule({
  declarations: [
    DoctorRegisterComponent,
    DoctorHomeComponent,
    DoctorProfileComponent
  ],
  imports: [
    CommonModule,
    CommonLayoutModule,
    UserModule,
    ReactiveFormsModule,
    DoctorRoutingModule
  ],
  exports: [
    DoctorHomeComponent
  ]
})
export class DoctorModule { }
