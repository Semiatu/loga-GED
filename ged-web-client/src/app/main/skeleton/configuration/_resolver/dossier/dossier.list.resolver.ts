import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DossierService } from 'src/app/main/skeleton/configuration/_service';
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable({ providedIn: "root"})
export class DossierListResolver extends AbstractListResolver implements Resolve<any> {

    dossiers: any[];
    onDossiersChanged: BehaviorSubject<any>;
    total: number;

    constructor(private dossierService: DossierService) {
        super();
        this.onDossiersChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getDossiers(),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected getDossiers(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dossierService.findAllPage(0, 10)
                .subscribe(response => {
                    this.dossiers = Helpers.getOthers(response);
                    this.total = Helpers.getTotalElements(response);
                    this.onDossiersChanged.next(this.dossiers);
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
