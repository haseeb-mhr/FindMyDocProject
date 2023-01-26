import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserUpdateComponent } from './_components/user-update/user-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRoleUpdateComponent } from './_components/user-role-update/user-role-update.component';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { EditPracticeLocationComponent } from './_components/edit-practice-location/edit-practice-location.component';
import { AgmCoreModule } from '@agm/core';
import { EditSpecializationComponent } from './_components/edit-specialization/edit-specialization.component';
import { EditQualificationComponent } from './_components/edit-qualification/edit-qualification.component';

@NgModule({
  declarations: [
    UserUpdateComponent,
    UserRoleUpdateComponent,
    EditPracticeLocationComponent,
    EditSpecializationComponent,
    EditQualificationComponent
  ],
  imports: [
    CommonModule,
    CommonLayoutModule,
    UserRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'TODO',
      libraries: ['places']
    }),
    ReactiveFormsModule
  ],
  exports:[
    UserUpdateComponent,
    EditPracticeLocationComponent,
    EditSpecializationComponent,
    EditQualificationComponent
  ]
})
export class UserModule { }
