import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private cookieService: CookieService) {}

    error = '';

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        return next.handle(request).pipe(catchError(err => {
            console.log("call -- ErrorInterceptor"+err);
            
            if (err.status === 401) { //unauthorized
                
                // if unauthorize remove local storage
                localStorage.removeItem('currentUser');

                const refreshTokenCookieExists: boolean = this.cookieService.check('refresh_token');

                if(refreshTokenCookieExists) {
                    this.authenticationService.refresh(this.cookieService.get('refresh_token')).pipe()
                        .subscribe(
                            data => {
                                console.log('call -- refresh token');location.reload(true);
                            },
                            error => {
                                console.log(error);
                                return false;
                            }
                        );
                } else {
                    this.authenticationService.logout;
                    location.reload(true);
                }
            }


            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}