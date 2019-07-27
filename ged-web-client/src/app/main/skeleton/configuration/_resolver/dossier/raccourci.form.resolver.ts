import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import { Raccourci } from 'src/app/main/skeleton/configuration/_model';
import {RaccourciService} from "../../_service/raccourci.service";

@Injectable({ providedIn: "root" })
export class RaccourciFormResolver implements Resolve<any> {

    onRaccourcisChanged: BehaviorSubject<any>;
    raccourci: Raccourci;

    constructor(private raccourciService: RaccourciService) {
        this.onRaccourcisChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const values = [];
        if (route.params) {
            const id = route.params.id;
            if (id && Number.isInteger(+id)) {
                values.push(this.find(id));
            } else {
                this.raccourci = null;
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
            this.raccourciService.find(id)
                .subscribe(response => {
                    this.raccourci = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }
}
