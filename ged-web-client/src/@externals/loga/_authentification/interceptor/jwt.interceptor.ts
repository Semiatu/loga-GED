import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Helpers} from 'src/@externals/loga/_utility/helpers';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {Paths} from 'src/environments/paths';
import {projectOption} from 'src/environments/project.option';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private routes = ['/authentication'];

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(projectOption.tokenKey);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
          // Authorization: `${token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 403) {
          this.authenticationService.logout();
          if (this.routes.indexOf(this.router.url) < 0) {
            Helpers.saveInLocalStorage('url', this.router.url);
          }
          Helpers.saveInLocalStorage('m', 'Erreur message');
          this.router.navigateByUrl(Paths.login);
        }
        throw error;
      })
    );
  }
}
