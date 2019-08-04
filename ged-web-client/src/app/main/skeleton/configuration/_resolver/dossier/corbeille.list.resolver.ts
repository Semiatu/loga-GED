import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import { Observable} from 'rxjs';
import {DossierService} from 'src/app/main/skeleton/configuration/_service';
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';

@Injectable({ providedIn: "root"})
export class CorbeilleListResolver extends AbstractListResolver implements Resolve<any> {

    wrapper: any;
    mapwrapper: any[] = [];

    constructor(private dossierService: DossierService) {
        super();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getCorbeilleContent(),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected getCorbeilleContent(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dossierService.getCorbeilleContent()
                .subscribe(response => {
                    this.wrapper = Helpers.getOthers(response);
                    this.mapwrapper = [];

                    this.mapwrapper.push(...this.wrapper.dossiers)
                    this.mapwrapper.push(...this.wrapper.documents)
                    this.mapwrapper.push(...this.wrapper.raccourcis)
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
