import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRoles } from '../_models/enums/user-roles.model';
import { ApplicationService } from '../_services/application.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(private applicationSvc: ApplicationService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.applicationSvc.userValue;
    if (user.userRole == UserRoles.Admin) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
  
}
