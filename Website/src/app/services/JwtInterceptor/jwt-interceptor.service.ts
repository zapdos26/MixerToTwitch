import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (this.cookieService.get('token')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.cookieService.get('token')}`
        }
      });
    }
    return next.handle(request);
  }
}
