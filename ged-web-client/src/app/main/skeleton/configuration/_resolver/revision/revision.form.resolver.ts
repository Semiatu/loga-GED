import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import {RevisionService} from "../../_service";
import {Revision } from "../../_model/revision";

@Injectable({ providedIn: "root" })
export class RevisionFormResolver implements Resolve<any> {

    onRevisionsChanged: BehaviorSubject<any>;
    revision: Revision;

    constructor(private revisionService: RevisionService) {
        this.onRevisionsChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const values = [];
        if (route.params) {
            const id = route.params.id;
            if (id && Number.isInteger(+id)) {
                values.push(this.find(id));
            } else {
                this.revision = null;
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
            this.revisionService.find(id)
                .subscribe(response => {
                    this.revision = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }
}
