import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import { DummyService } from 'src/app/main/skeleton/configuration/_service';
import { Dummy } from 'src/app/main/skeleton/configuration/_model';

@Injectable()
export class DummyFormResolver implements Resolve<any> {

  onDummiesChanged: BehaviorSubject<any>;
  dummy: Dummy;

  constructor(private dummyService: DummyService) {
    this.onDummiesChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const values = [];
    if (route.params) {
      const id = route.params.id;
      if (id && Number.isInteger(+id)) {
        values.push(this.find(id));
      } else {
        this.dummy = null;
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
      this.dummyService.find(id)
        .subscribe(response => {
          this.dummy = Helpers.getOthers(response);
          resolve(response);
        }, reject);
    });
  }
}
