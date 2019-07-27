import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import {Raccourci} from 'src/app/main/skeleton/configuration/_model';
import {catchError} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import {RaccourciCriteria} from "../_criteria/raccourciCriteria";


@Injectable({
    providedIn: 'root'
})
export class RaccourciService extends AbstractService<Raccourci, number> {


    protected address(): string {
        return '/raccourcis';
    }

    search(criteria: RaccourciCriteria, page: number, size: number): Observable<HttpEvent<Raccourci[]>> {
        page = (page === undefined) ? 0 : page;
        size = (size === undefined) ? 5 : size;
        const url = this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page;
        return this.httpClient
            .post<Raccourci[]>(url, JSON.stringify(criteria), this.baseOption)
            .pipe(catchError(this.handleError));
    }

    public creerRaccourciPourRacourcisave(raccourci: Raccourci, id : number) {
        return this.httpClient.post(encodeURI(this.apiUrl.concat(this.address())) + '/cree-raccourci-de-raccourci/' + id, JSON.stringify(raccourci), this.baseOption)
            .pipe(catchError(this.handleError));
    }
}
