import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {LangueService} from "../../_service/langue.serveice";
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable({ providedIn: "root" })
export class LangueListResolver extends AbstractListResolver implements Resolve<any> {

    langues: any[];
    onLanguesChanged: BehaviorSubject<any>;
    total: number;

    constructor(private langueService: LangueService) {
        super();
        this.onLanguesChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getLangues(),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected getLangues(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.langueService.findAllPage(0, 10)
                .subscribe(response => {
                    this.langues = Helpers.getOthers(response);
                    this.total = Helpers.getTotalElements(response);
                    this.onLanguesChanged.next(this.langues);
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
