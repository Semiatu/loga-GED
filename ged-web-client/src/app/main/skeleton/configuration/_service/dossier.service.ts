import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import {Dossier} from 'src/app/main/skeleton/configuration/_model';
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

    // nous permet de communique avec le backEnd pour avoir le contenu d'un dossier
    getContent(idDossier){
        return this.httpClient.get<ContenuDossierWrapper>(encodeURI(this.apiUrl + this.address() + '/get-content/' + idDossier), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    getTreeContent(idDossier){
        return this.httpClient.get<any>(encodeURI(this.apiUrl + this.address() + '/get-tree-data/' + idDossier), this.baseOption)
            .pipe(catchError(this.handleError));
    }



}
