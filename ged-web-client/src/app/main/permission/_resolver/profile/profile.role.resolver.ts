import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileRoleService, ProfileService, RoleService } from 'src/app/main/permission/_service';
import { Helpers } from 'src/@externals/loga/_utility';
import { Profile, Role } from 'src/app/main/permission/_model';

@Injectable()
export class ProfileRoleResolver implements Resolve<any> {
  profile: Profile;
  rolesSource: Role[];
  rolesTarget: Role[];

  constructor(
    private profileService: ProfileService,
    private roleService: RoleService,
    private profileRoleService: ProfileRoleService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const values = [];
    if (route.params) {
      const id = route.params.id;
      if (id && Number.isInteger(+id)) {
        values.push(...[this.find(id)]);
      }
    }
    return new Promise((resolve, reject) => {
      Promise.all(values).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  private find(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.profileService.find(id)
        .subscribe(response => {
          this.profile = Helpers.getOthers(response);
          this.getRoles().then(v => resolve(this.profile));
        }, reject);
    });
  }

  private getRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.profileRoleService.findAllRoleByProfile(this.profile).subscribe(
        dataTarget => {
          this.rolesTarget = Helpers.getOthers(dataTarget);
          if (!this.rolesTarget) {
            this.rolesTarget = [];
          }
          this.roleService.findAllSource(this.rolesTarget.map(target => target.id)).subscribe(
            dataSource => {
              this.rolesSource = Helpers.getOthers(dataSource);
              resolve(this.rolesTarget);
            });
        }, reject);
    });
  }
}
