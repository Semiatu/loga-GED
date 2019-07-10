import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import { ProfileService } from 'src/app/main/permission/_service';
import { Profile } from 'src/app/main/permission/_model';

@Injectable()
export class ProfileFormResolver implements Resolve<any> {
  profile: Profile;

  onProfilesChanged: BehaviorSubject<any>;

  constructor(
    private profileService: ProfileService,
  ) {
    this.onProfilesChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const values = [];
    if (route.params) {
      const id = route.params.id;
      if (id && Number.isInteger(+id)) {
        values.push(this.find(id));
      } else {
        this.profile = null;
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
          resolve(response);
        }, reject);
    });
  }
}
