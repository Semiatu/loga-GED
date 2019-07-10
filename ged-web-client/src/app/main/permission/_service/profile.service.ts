import {Injectable} from '@angular/core';
import {AbstractService} from 'src/@externals/loga/_abstract/abstract.service';
import {Profile} from 'src/app/main/permission/_model';
import {catchError} from 'rxjs/operators';
import {ProfileCriteria} from 'src/app/main/permission/_criteria';


@Injectable({
  providedIn: 'root'
})
export class ProfileService extends AbstractService<Profile, number> {

  protected address(): string {
    return '/profiles';
  }

  search(criteria: ProfileCriteria, page: number, size) {
    return this.httpClient.post<Profile[]>(this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page,
      JSON.stringify(criteria), this.baseOption).pipe(catchError(this.handleError));
  }
}
