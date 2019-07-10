import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileService } from 'src/app/main/permission/_service';
import { Helpers } from 'src/@externals/loga/_utility';
import { Profile } from 'src/app/main/permission/_model';

@Injectable()
export class ProfileListResolver implements Resolve<any> {
  profiles: Profile[];

  onUsersChanged: BehaviorSubject<any>;
  onProfilesChanged: BehaviorSubject<any>;
  total: number;

  constructor(
    private profileService: ProfileService
  ) {
    this.onUsersChanged = new BehaviorSubject({});
    this.onProfilesChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getProfiles()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  private getProfiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.profileService.findAllPage(0, 10)
        .subscribe(response => {
          this.profiles = Helpers.getOthers(response);
          this.total = Helpers.getTotalElements(response);
          this.onProfilesChanged.next(this.profiles);
          resolve(response);
        }, reject);
    });
  }
}
