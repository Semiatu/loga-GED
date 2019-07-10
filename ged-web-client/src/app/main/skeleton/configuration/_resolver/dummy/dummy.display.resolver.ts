import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Helpers} from 'src/@externals/loga/_utility';
import {DummyService} from '../../_service';
import {Dummy} from '../../_model';

@Injectable()
export class DummyDisplayResolver implements Resolve<any> {

    dummy: Dummy;

    constructor(
        private dummyService: DummyService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            const values = [];
            if (route.params) {
                const id = route.params.id;
                if (!isNaN(+id)) {
                    values.push(this.find(id));
                }
            }
            Promise.all(values).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected find(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dummyService.find(id)
                .subscribe(response => {
                    this.dummy = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }


}
