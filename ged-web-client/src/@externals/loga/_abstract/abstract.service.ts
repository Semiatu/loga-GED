import { ConstanteService } from 'src/@externals/loga/_service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export abstract class AbstractService<T, ID> {

  protected apiUrl: string;
  protected baseOption: any;
  protected uploadOption: any;

  constructor(protected httpClient: HttpClient) {
    this.apiUrl = environment.serverUrl;
    this.baseOption = ConstanteService.baseOption();
    this.uploadOption = ConstanteService.uploadOption();
  }

  public findAll() {
    return this.httpClient.get<T[]>(encodeURI(this.apiUrl + this.address() + '/all-t'), this.baseOption)
      .pipe(catchError(this.handleError));
  }

  public findAllPage(page: number, size?: number) {
    size = (size === undefined) ? 2 : size;

    return this.httpClient.get<T[]>(encodeURI(this.apiUrl + this.address() + '?size=' + size + '&page=' + page), this.baseOption)
      .pipe(catchError(this.handleError));
  }


  public find(id: ID) {
    return this.httpClient.get<T>(encodeURI(this.apiUrl + this.address() + '/' + id), this.baseOption)
      .pipe(catchError(this.handleError));
  }


  public save(entity: T) {
    return this.httpClient.post(encodeURI(this.apiUrl.concat(this.address())), JSON.stringify(entity), this.baseOption)
      .pipe(catchError(this.handleError));
  }

  public update(id: ID, entity: T) {
    return this.httpClient.put(encodeURI(this.apiUrl.concat(this.address() + '/' + id)), JSON.stringify(entity), this.baseOption)
      .pipe(catchError(this.handleError));
  }

  public delete(id: ID) {
    return this.httpClient.delete(encodeURI(this.apiUrl + this.address() + '/' + id), this.baseOption)
      .pipe(catchError(this.handleError));
  }

  public upload(id: number, obj: FormData) {
    return this.httpClient.post(
      encodeURI(this.apiUrl + this.address() + '/upload?id=' + id),
      obj,
      this.uploadOption
    );
  }

  protected handleError(error) {
    return throwError(error);
  }

  protected abstract address(): string;
}
