import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { IsAdminGuard } from '../_guards/is-admin.guard';
import { UserRoleUpdateComponent } from './_components/user-role-update/user-role-update.component';
import { UserUpdateComponent } from './_components/user-update/user-update.component';

const routes: Routes = [
  {
    path: 'updateDetails',
    component: UserUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update',
    component: UserRoleUpdateComponent,
    canActivate: [AuthGuard, IsAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
