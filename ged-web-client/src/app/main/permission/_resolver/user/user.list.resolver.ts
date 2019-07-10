import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from 'src/app/main/permission/_service';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable()
export class UserListResolver implements Resolve<any> {
  users: any[];
  profilesIn: any[];
  kvProfilesIn: any[];

  onUsersChanged: BehaviorSubject<any>;
  onProfilesChanged: BehaviorSubject<any>;
  total: number;

  constructor(
    private userService: UserService
  ) {
    this.onUsersChanged = new BehaviorSubject({});
    this.onProfilesChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getUsers(),
        this.getProfilesIn()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  protected getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.findAllPage(0, 10)
        .subscribe(response => {
          this.users = Helpers.getOthers(response);
          this.total = Helpers.getTotalElements(response);
          this.onUsersChanged.next(this.users);
          resolve(response);
        }, reject);
    });
  }

  private getProfilesIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.profileIn()
        .subscribe(response => {
          this.profilesIn = Helpers.getOthers(response);
          // this.kvProfilesIn = this.profilesIn.map(profile => ({ label: profile.name.toUpperCase(), value: profile }));
          this.kvProfilesIn = this.profilesIn.map(profile => ({ label: profile.name, value: profile }));
          this.onProfilesChanged.next(this.profilesIn);
          resolve(response);
        }, reject);
    });
  }
}
