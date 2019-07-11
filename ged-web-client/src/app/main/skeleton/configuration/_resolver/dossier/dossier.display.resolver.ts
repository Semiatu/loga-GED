import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Helpers} from 'src/@externals/loga/_utility';
import {DossierService} from '../../_service';
import {Dossier} from '../../_model';

@Injectable({ providedIn: "root" })
export class DossierDisplayResolver implements Resolve<any> {

    dossier: Dossier;

    constructor(
        private dossierService: DossierService
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
            this.dossierService.find(id)
                .subscribe(response => {
                    this.dossier = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }


}
