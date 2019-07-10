import {Injectable} from '@angular/core';
import { AbstractService } from 'src/@externals/loga/_abstract';
import {Role} from 'src/app/main/permission/_model';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoleService extends AbstractService<Role, number> {

  protected address(): string {
    return '/roles';
  }

  public findAll() {
    return this.httpClient.get<Role[]>(encodeURI(this.apiUrl + this.address() + '/all-t'), this.baseOption);
  }

  findAllSource(numbers: number[]) {
    return this.httpClient.put<Role[]>(encodeURI(this.apiUrl + this.address() + '/all-source-role'), JSON.stringify(numbers),
      this.baseOption).pipe(catchError(this.handleError));
  }
}
