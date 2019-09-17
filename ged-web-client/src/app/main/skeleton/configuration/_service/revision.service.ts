import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import { Revision } from "../_model/revision";
import {RevisionCriteria} from "../_criteria";
import {Observable} from "rxjs";
import {HttpEvent} from "@angular/common/http";
import {catchError} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class RevisionService extends AbstractService<Revision, number> {


    protected address(): string {
        return '/revision';
    }

    search(criteria: RevisionCriteria, page: number, size: number): Observable<HttpEvent<Revision[]>> {
        page = (page === undefined) ? 0 : page;
        size = (size === undefined) ? 0 : size;
        /*(page === undefined) ? page =  0 : page =  page;
        (size === undefined) ? size =  5 : size =  size;*/

        const url = this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page;
        return this.httpClient
            .post<Revision[]>(url, JSON.stringify(criteria), this.baseOption)
            .pipe(catchError(this.handleError));
    }
}