import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import { ProfileService, UserService } from 'src/app/main/permission/_service';
import { Profile, User } from 'src/app/main/permission/_model';
import { Item } from 'src/@externals/loga/item';

@Injectable()
export class UserFormResolver implements Resolve<any> {
  profiles: Profile[];
  kvProfiles: Item[] = [];
  onUsersChanged: BehaviorSubject<any>;
  onProfilesChanged: BehaviorSubject<any>;
  user: User;

  constructor(
    private userService: UserService,
    private profileService: ProfileService
  ) {
    this.onUsersChanged = new BehaviorSubject({});
    this.onProfilesChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const values = [
      this.getProfiles()
    ];
    if (route.params) {
      const id = route.params.id;
      if (id && Number.isInteger(+id)) {
        values.push(this.find(id));
      } else {
        this.user = null;
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

  private getProfiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.profileService.findAll()
        .subscribe(response => {
          this.profiles = Helpers.getOthers(response);
          // this.kvProfiles = this.profiles.map(profile => ({ label: profile.name.toUpperCase(), value: profile }));
          this.kvProfiles = this.profiles.map(profile => ({ label: profile.name, value: profile }));
          this.onProfilesChanged.next(this.profiles);
          resolve(response);
        }, reject);
    });
  }

  private find(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.find(id)
        .subscribe(response => {
          this.user = Helpers.getOthers(response);
          resolve(response);
        }, reject);
    });
  }
}
