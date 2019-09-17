import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Helpers} from 'src/@externals/loga/_utility';
import {LangueService} from "../../_service/langue.serveice";
import {Langue} from "../../_model/langue";

@Injectable({ providedIn: "root" })
export class LangueDisplayResolver implements Resolve<any> {

    langue: Langue;

    constructor(
        private langueService: LangueService
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
            this.langueService.find(id)
                .subscribe(response => {
                    this.langue = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }


}
