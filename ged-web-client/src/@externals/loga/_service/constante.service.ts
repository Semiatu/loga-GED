import { HttpHeaders } from '@angular/common/http';

export class ConstanteService {
  constructor() {
  }

  public static baseOption() {
    const _headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return { headers: _headers };
  }

  public static uploadOption() {
    const _headers = new HttpHeaders({
      enctype: 'multipart/form-data',
    });
    return { headers: _headers };
  }

}
