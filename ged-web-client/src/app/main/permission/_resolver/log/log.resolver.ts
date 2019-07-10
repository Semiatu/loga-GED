import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogService } from 'src/app/main/permission/_service';
import { Helpers } from 'src/@externals/loga/_utility';
import { Log } from 'src/app/main/permission/_model';
import { Item } from 'src/@externals/loga/item';

@Injectable()
export class LogResolver implements Resolve<any> {
  logs: Log[];
  kvUsersIn: Item[];

  onLogsChanged: BehaviorSubject<any>;
  total: number;

  constructor(
    private logService: LogService,
  ) {
    this.onLogsChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getLogs(),
        this.getUsers()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  private getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logService.usersIn()
        .subscribe(response => {
          const users = Helpers.getOthers(response);
          this.kvUsersIn = users.map(user => ({ label: user, value: user }));
          resolve(response);
        }, reject);
    });
  }

  private getLogs(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logService.findAllPage(0, 10)
        .subscribe(response => {
          this.logs = Helpers.getOthers(response);
          this.total = Helpers.getTotalElements(response);
          this.onLogsChanged.next(this.logs);
          resolve(response);
        }, reject);
    });
  }
}
