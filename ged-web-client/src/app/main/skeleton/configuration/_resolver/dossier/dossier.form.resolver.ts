import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Helpers } from 'src/@externals/loga/_utility';
import { DossierService } from 'src/app/main/skeleton/configuration/_service';
import { Dossier } from 'src/app/main/skeleton/configuration/_model';

@Injectable({ providedIn: "root" })
export class DossierFormResolver implements Resolve<any> {

    onDossiersChanged: BehaviorSubject<any>;
    dossier: Dossier;

    constructor(private dossierService: DossierService) {
        this.onDossiersChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const values = [];
        if (route.params) {
            const id = route.params.id;
            if (id && Number.isInteger(+id)) {
                values.push(this.find(id));
            } else {
                this.dossier = null;
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
            this.dossierService.find(id)
                .subscribe(response => {
                    this.dossier = Helpers.getOthers(response);
                    resolve(response);
                }, reject);
        });
    }
}
