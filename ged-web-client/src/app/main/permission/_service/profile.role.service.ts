import { Injectable } from '@angular/core';
import { AbstractService } from 'src/@externals/loga/_abstract';
import { Profile, Role, ProfileRoleWrapper, ProfileRole } from 'src/app/main/permission/_model';
import { catchError } from 'rxjs/operators';
import { pipe } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProfileRoleService extends AbstractService<ProfileRole, number> {

  protected address(): string {
    return '/profile-roles';
  }

  public findAllRoleByProfile(profile: Profile) {
    return this.httpClient.get<Role[]>(encodeURI(this.apiUrl + this.address() + '/r?profile=' + profile.id), this.baseOption).
    pipe(catchError(this.handleError));
  }

  updateProfileRoles(obj: ProfileRoleWrapper) {
    return this.httpClient.post(encodeURI(this.apiUrl.concat(this.address() + '/update-roles')), JSON.stringify(obj), this.baseOption)
      .pipe(catchError(this.handleError));
  }

}
