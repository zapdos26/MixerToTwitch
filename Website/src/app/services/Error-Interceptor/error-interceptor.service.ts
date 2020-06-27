import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest,
  HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Router} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor{
  constructor( private router: Router) { }
  handleError = (error: HttpErrorResponse) => {
    this.router.navigateByUrl('/error',{ state:{status:error.status, statusText: error.statusText, error: error.error}}).then()
    return throwError(error)
  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>>{
    return next.handle(req)
      .pipe(
        catchError(this.handleError)
      )
  };
}
