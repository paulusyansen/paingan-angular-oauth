import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../_services';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService, private cookieService: CookieService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: 'Bearer '+ currentUser.token
                }
            });
        }
        
        //return next.handle(request);

        return next.handle(request).pipe(
            catchError(err => {console.log('call -- jwtinterceptor:'+err);
                if (err instanceof HttpErrorResponse && err.status === 0) {
                    console.log('Check Your Internet Connection And Try again Later');
                } else if (err instanceof HttpErrorResponse && err.status === 401) {
                    console.log('---- unauthorized');
                }
                return throwError(err);
            })
        );
    }
}