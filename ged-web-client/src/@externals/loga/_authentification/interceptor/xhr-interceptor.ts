import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    request.headers.delete('WWW-Authenticate');
    request = request.clone({
      headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(request);
  }
}
