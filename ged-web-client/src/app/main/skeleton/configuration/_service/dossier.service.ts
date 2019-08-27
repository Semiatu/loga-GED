import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import {Document, Dossier, Raccourci} from 'src/app/main/skeleton/configuration/_model';
import {DossierCriteria} from "../_criteria";
import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {ContenuDossierWrapper} from "../wrapper/contenu-dossier-wrapper";


@Injectable({
    providedIn: 'root'
})
export class DossierService extends AbstractService<Dossier, number> {


    protected address(): string {
        return '/dossier';
    }

    search(criteria: DossierCriteria, page: number, size: number): Observable<HttpEvent<Dossier[]>> {
        page = (page === undefined) ? 0 : page;
        size = (size === undefined) ? 0 : size;
        /*(page === undefined) ? page =  0 : page =  page;
        (size === undefined) ? size =  5 : size =  size;*/

        const url = this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page;
        return this.httpClient
            .post<Dossier[]>(url, JSON.stringify(criteria), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    //contenu d'un dossier
    getContent(idDossier) {
        return this.httpClient.get<ContenuDossierWrapper>(encodeURI(this.apiUrl + this.address() + '/get-content/' + idDossier), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    //contenu de la corbeille
    getCorbeilleContent() {
        return this.httpClient.get<ContenuDossierWrapper>(encodeURI(this.apiUrl + this.address() + '/get-corbeille-content/'), this.baseOption)
            .pipe(catchError(this.handleError));
    }


    // raccourci d'un contenu
    getTreeContent(idDossier) {
        return this.httpClient.get<any>(encodeURI(this.apiUrl + this.address() + '/get-tree-data/' + idDossier), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    // deplacement d'un contenu
    getDossierTreeContent(idDossier, ids) {
        return this.httpClient.post<any>(encodeURI(this.apiUrl + this.address() + '/get-dossier-tree-data/' + idDossier), ids , this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public addInCorbeille(id) {
        return this.httpClient.put<Dossier[]>(encodeURI(this.apiUrl + this.address() + '/add-corbeille/' + id), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public delete(id: number) {
        return this.httpClient.delete(encodeURI(this.apiUrl + this.address() + '/delete-dossier/' + id), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public deleteAll(contenuDossierWrapper:ContenuDossierWrapper) {
        return this.httpClient.put(encodeURI(this.apiUrl + this.address() + '/delete-all/'), contenuDossierWrapper , this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public restaurer(id) {
        return this.httpClient.put<Raccourci[]>(encodeURI(this.apiUrl + this.address() + '/restaurer/' + id), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public addAllSelectedCorbeille(contenuDossierWrapper) {
        return this.httpClient.post(encodeURI(this.apiUrl + this.address() + '/add-all-in-corbeille/'),contenuDossierWrapper,  this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public restaureAllSelected(contenuDossierWrapper) {
        return this.httpClient.post(encodeURI(this.apiUrl + this.address() + '/restaure-all-selected/'),contenuDossierWrapper,  this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public deplaceAllSelected(contenuDossierWrapper) {
        return this.httpClient.post(encodeURI(this.apiUrl + this.address() + '/deplace-all-selected/'),contenuDossierWrapper,  this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public save(entity: Dossier) {
        return this.httpClient.post(encodeURI(this.apiUrl.concat(this.address() + '/create')), JSON.stringify(entity), this.baseOption)
            .pipe(catchError(this.handleError));
    }

}
