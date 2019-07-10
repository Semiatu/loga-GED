import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract';
import {Log} from 'src/app/main/permission/_model';
import {LogCriteria} from 'src/app/main/permission/_criteria';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LogService extends AbstractService<Log, number> {

  protected address(): string {
    return '/logs';
  }

  usersIn() {
    return this.httpClient.get<string[]>(this.apiUrl + this.address() + '/users',
      this.baseOption).pipe(catchError(this.handleError));
  }

  search(criteria: LogCriteria, page: number, size: number) {
    return this.httpClient.put<Log[]>(this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page,
      JSON.stringify(criteria),
      this.baseOption).pipe(catchError(this.handleError));
  }
}
