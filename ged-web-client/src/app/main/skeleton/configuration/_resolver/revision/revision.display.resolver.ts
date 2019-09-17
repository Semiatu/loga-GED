import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Helpers} from 'src/@externals/loga/_utility';
import {RevisionService} from "../../_service";
import {Revision} from "../../_model/revision";

@Injectable({ providedIn: "root" })
export class RevisionDisplayResolver implements Resolve<any> {

    revision: Revision;

    constructor(
        private revisionService: RevisionService
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
            this.revisionService.find(id)
                .subscribe(response => {
                    this.revision = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }


}
