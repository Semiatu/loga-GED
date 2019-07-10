import { Injectable } from '@angular/core';
import { AbstractService } from 'src/@externals/loga/_abstract/abstract.service';
import { User } from 'src/app/main/permission/_model';
import { catchError } from 'rxjs/operators';
import { UserCriteria } from 'src/app/main/permission/_criteria';


@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService<User, number> {

  protected address(): string {
    return '/users';
  }

  findByUsername(username: string) {
    return this.httpClient.get<User>(this.apiUrl + this.address() + '/f?u=' + username, this.baseOption)
      .pipe(catchError(this.handleError));
  }

  login(user) {
    return this.httpClient.post<User>(this.apiUrl + '/login', JSON.stringify(user), { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  profileIn() {
    return this.httpClient.get<User>(this.apiUrl + this.address() + '/profiles', this.baseOption)
      .pipe(catchError(this.handleError));
  }

  search(criteria: UserCriteria, page: number, size: number) {
    size = (size === undefined) ? 2 : size;
    return this.httpClient.post<User[]>(this.apiUrl + this.address() + '/search?size=' + size + '&page=' + page, JSON.stringify(criteria),
      this.baseOption).pipe(catchError(this.handleError));
  }
}
