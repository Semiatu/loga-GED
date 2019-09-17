import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import { Categorie } from "../_model/categorie";
import {CategorieCriteria} from "../_criteria";
import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";
import {catchError} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class CategorieService extends AbstractService<Categorie, number> {


    protected address(): string {
        return '/categorie';
    }

    search(criteria: CategorieCriteria, page: number, size: number): Observable<HttpEvent<Categorie[]>> {
        page = (page === undefined) ? 0 : page;
        size = (size === undefined) ? 0 : size;
        /*(page === undefined) ? page =  0 : page =  page;
        (size === undefined) ? size =  5 : size =  size;*/

        const url = this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page;
        return this.httpClient
            .post<Categorie[]>(url, JSON.stringify(criteria), this.baseOption)
            .pipe(catchError(this.handleError));
    }
}