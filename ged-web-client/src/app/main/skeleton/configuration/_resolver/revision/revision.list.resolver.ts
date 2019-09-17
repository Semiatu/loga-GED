import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {RevisionService} from "../../_service";
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable({ providedIn: "root" })
export class RevisionListResolver extends AbstractListResolver implements Resolve<any> {

    revisions: any[];
    onRevisionsChanged: BehaviorSubject<any>;
    total: number;

    constructor(private revisionService: RevisionService) {
        super();
        this.onRevisionsChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getRevisions(),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected getRevisions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.revisionService.findAllPage(0, 10)
                .subscribe(response => {
                    this.revisions = Helpers.getOthers(response);
                    this.total = Helpers.getTotalElements(response);
                    this.onRevisionsChanged.next(this.revisions);
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
