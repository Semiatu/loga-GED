import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DummyService } from 'src/app/main/skeleton/configuration/_service';
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable()
export class DummyListResolver extends AbstractListResolver implements Resolve<any> {

  dummies: any[];
  onDummiesChanged: BehaviorSubject<any>;
  total: number;

  constructor(private dummyService: DummyService) {
    super();
    this.onDummiesChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getDummies(),
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  protected getDummies(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dummyService.findAllPage(0, 10)
        .subscribe(response => {
          this.dummies = Helpers.getOthers(response);
          this.total = Helpers.getTotalElements(response);
          this.onDummiesChanged.next(this.dummies);
          resolve(response);
        }, reject);
    });
  }

  public hasDetails(): boolean {
    return true;
  }

  public hasUpload(): boolean {
    return false;
  }

}
