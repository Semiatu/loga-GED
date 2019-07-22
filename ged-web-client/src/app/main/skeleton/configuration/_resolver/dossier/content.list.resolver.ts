import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {DocumentService, DossierService} from 'src/app/main/skeleton/configuration/_service';
import { AbstractListResolver } from 'src/@externals/loga/_abstract';
import { Helpers } from 'src/@externals/loga/_utility';
import {Dossier} from "../../_model";

@Injectable({ providedIn: "root"})
export class ContentListResolver extends AbstractListResolver implements Resolve<any> {

    wrapper: any;
    dossier: Dossier;
    mapwrapper: any[] = [];
    idDossier: any;
    onContenusChanged: BehaviorSubject<any>;
    dataSource = new Subject<any>();
    data = this.dataSource.asObservable();

    constructor(private dossierService: DossierService) {
        super();
        this.onContenusChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
         this.idDossier = route.params.id ? route.params.id : 0 ;
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getContenus(),
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    protected getContenus(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dossierService.getContent( this.idDossier)
                .subscribe(response => {
                    this.wrapper = Helpers.getOthers(response);
                    this.dossier = this.wrapper.dossier;
                    this.mapwrapper = [];

                    for (let wrapperKey in this.wrapper.dossiers) {
                        this.mapwrapper.push(this.wrapper.dossiers[wrapperKey])
                    }

                    for (let wrapperKey in this.wrapper.documents) {
                        this.mapwrapper.push(this.wrapper.documents[wrapperKey])
                    }
                    this.dataSource.next([this.dossier, this.mapwrapper]);
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
