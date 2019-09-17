import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import {Langue} from "../_model";
import {LangueCriteria} from "../_criteria/langue.criteria";
import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";
import {catchError} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class LangueService extends AbstractService<Langue, number> {


    protected address(): string {
        return '/langue';
    }

    search(criteria: LangueCriteria, page: number, size: number): Observable<HttpEvent<Langue[]>> {
        page = (page === undefined) ? 0 : page;
        size = (size === undefined) ? 0 : size;
        /*(page === undefined) ? page =  0 : page =  page;
        (size === undefined) ? size =  5 : size =  size;*/

        const url = this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page;
        return this.httpClient
            .post<Langue[]>(url, JSON.stringify(criteria), this.baseOption)
            .pipe(catchError(this.handleError));
    }
}