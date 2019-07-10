import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import {Dummy} from 'src/app/main/skeleton/configuration/_model';
import {catchError} from 'rxjs/operators';
import {DummyCriteria} from 'src/app/main/skeleton/configuration/_criteria';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DummyService extends AbstractService<Dummy, number> {


  protected address(): string {
    return '/dummies';
  }

  search(criteria: DummyCriteria, page: number, size: number): Observable<HttpEvent<Dummy[]>> {
    page = (page === undefined) ? 0 : page;
    size = (size === undefined) ? 5 : size;
    const url = this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page;
    return this.httpClient
        .post<Dummy[]>(url, JSON.stringify(criteria), this.baseOption)
        .pipe(catchError(this.handleError));
  }

}
