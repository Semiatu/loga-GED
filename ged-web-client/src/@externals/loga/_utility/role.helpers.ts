import {Helpers} from './helpers';
import {Router, RouterStateSnapshot} from '@angular/router';
import {NAVIGATION_MAP} from './roles';
import {projectOption} from 'src/environments/project.option';
import {Paths} from 'src/environments/paths';

export class RoleHelpers {
  public static rolesString = Helpers.getInLocalStorage(projectOption.userRolesKey);
  public static roles = RoleHelpers.rolesString ? RoleHelpers.rolesString.split(',') : [];

  public static getTarget() {
    /*
    const keys = Object.keys(NAVIGATION_MAP);
    for (const key of keys) {
      if (RoleHelpers.roles.includes(key)) {
      }
    }
    return Paths.login;
    */
   return Paths.configurationPath('dummies');
  }

  public static checkRole(url: string) {
    url = url.substr(1);
    const role = this.getRole(url);
    return RoleHelpers.roles.includes(role) ? null : this.getTarget();
  }

  public static getRole(value: string) {
    const keys = Object.keys(NAVIGATION_MAP);
    for (const key in keys) {
      if (NAVIGATION_MAP[keys[key]] === value) {
        return keys[key];
      }
    }
  }

  public static checkAuthorization(router: Router, state: RouterStateSnapshot) {
    if (localStorage.getItem(projectOption.tokenKey)) {
      return true;
    }
    const booleanPromise = router.navigate([Paths.login], {queryParams: {to: state.url}});
    booleanPromise.then();
    return false;
  }

}
