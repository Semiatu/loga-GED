import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import {Document, Raccourci} from 'src/app/main/skeleton/configuration/_model';
import {DocumentCriteria} from "../_criteria";
import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";
import {catchError} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class DocumentService extends AbstractService<Document, number> {


    protected address(): string {
        return '/document';
    }

    getReceipt(url): Observable<any> {
        return this.httpClient.get(url, {responseType: 'blob'});
    }

    search(criteria: DocumentCriteria, page: number, size: number): Observable<HttpEvent<Document[]>> {
        page = (page === undefined) ? 0 : page;
        size = (size === undefined) ? 0 : size;
        /*(page === undefined) ? page =  0 : page =  page;
        (size === undefined) ? size =  5 : size =  size;*/

        const url = this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page;
        return this.httpClient
            .post<Document[]>(url, JSON.stringify(criteria), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public findByDossier(idDossier, page: number, size?: number) {
        size = (size === undefined) ? 2 : size;
        return this.httpClient.get<Document[]>(encodeURI(this.apiUrl + this.address() + '/dossier/' + idDossier + '?size=' + size + '&page=' + page), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public addInCorbeille(id){
        return this.httpClient.put<Document[]>(encodeURI(this.apiUrl + this.address() + '/add-corbeille/' + id), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public restaurer(id){
        return this.httpClient.put<Raccourci[]>(encodeURI(this.apiUrl + this.address() + '/restaurer/' + id), this.baseOption)
            .pipe(catchError(this.handleError));
    }

}
