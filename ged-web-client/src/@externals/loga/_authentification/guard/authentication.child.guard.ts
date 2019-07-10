import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {RoleHelpers} from 'src/@externals/loga/_utility/role.helpers';

@Injectable()
export class AuthenticationChildGuard implements CanActivateChild {

  constructor(private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return RoleHelpers.checkAuthorization(this.router, state);
  }
}
