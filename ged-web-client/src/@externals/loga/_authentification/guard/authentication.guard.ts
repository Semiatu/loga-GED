import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RoleHelpers} from 'src/@externals/loga/_utility/role.helpers';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return RoleHelpers.checkAuthorization(this.router, state);
  }
}
