import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {DocumentService, DossierService} from 'src/app/main/skeleton/configuration/_service';
import {AbstractListResolver} from 'src/@externals/loga/_abstract';
import {Helpers} from 'src/@externals/loga/_utility';
import {Authorisation, Dossier} from "../../_model";

@Injectable({providedIn: "root"})
export class ContentListResolver extends AbstractListResolver implements Resolve<any> {

    authorisations: Authorisation[];
    dossier: Dossier = null;
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
        this.idDossier = route.params.id ? route.params.id : 0;
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
            this.dossierService.getContent(this.idDossier)
                .subscribe(response => {
                    if (Number(this.idDossier) !== 0)
                        this.getDossier(this.idDossier);
                    this.authorisations = Helpers.getOthers(response);
                    this.dataSource.next([this.dossier, this.authorisations]);
                    resolve(response);
                }, reject);
        });
    }

    protected getDossier(id) {
        this.dossierService.find(id).subscribe(value => {
            this.dossier = Helpers.getOthers(value);
        });
    }

    public hasDetails(): boolean {
        return true;
    }

    public hasUpload(): boolean {
        return false;
    }

}
