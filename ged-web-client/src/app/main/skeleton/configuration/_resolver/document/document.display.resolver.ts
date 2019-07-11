import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Helpers} from 'src/@externals/loga/_utility';
import {DocumentService} from '../../_service';
import {Document} from '../../_model';

@Injectable({ providedIn: "root" })
export class DocumentDisplayResolver implements Resolve<any> {

    document: Document;

    constructor(
        private documentService: DocumentService
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
            this.documentService.find(id)
                .subscribe(response => {
                    this.document = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }


}
