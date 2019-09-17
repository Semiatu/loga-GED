import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import {LangueService} from "../../_service/langue.serveice";
import {Langue } from "../../_model/langue";

@Injectable({ providedIn: "root" })
export class LangueFormResolver implements Resolve<any> {

    onLanguesChanged: BehaviorSubject<any>;
    langue: Langue;

    constructor(private langueService: LangueService) {
        this.onLanguesChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const values = [];
        if (route.params) {
            const id = route.params.id;
            if (id && Number.isInteger(+id)) {
                values.push(this.find(id));
            } else {
                this.langue = null;
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
            this.langueService.find(id)
                .subscribe(response => {
                    this.langue = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }
}
