import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient, private cookieService: CookieService) { }
    cookieValue = 'UNKNOWN';

    login(username: string, password: string) {
        ///api/authenticate
        return this.http.post<any>('http://localhost:8700/auth/login', { username: username, password: password, rememberMe: true})
            .pipe(map((res:any) => {
                console.log('call -- Authentication Login');
                // login successful if there's a jwt token in the response
                if (res && res.access_token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username, token: res.access_token, refresh_token: res.refresh_token }));

                    const expDate = new Date();
                    expDate.setTime(expDate.getTime() + (60 * 1000));

                    this.cookieService.set( 'access_token', res.access_token, null, '/', document.location.hostname);
                    this.cookieService.set( 'refresh_token', res.refresh_token, null, '/', document.location.hostname);
                }
            }));
    }

    refresh(refresh_token: string) {
        return this.http.post<any>('http://localhost:8700/auth/refresh', {refreshToken: refresh_token})
            .pipe(map( (res:any) => {
                // refresh  successful if there's a jwt token in the response
                if (res && res.access_token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: res.username, token: res.access_token, refresh_token: res.refresh_token }));
                    
                    const expDate = new Date();
                    expDate.setTime(expDate.getTime() + (60 * 1000));

                    this.cookieService.set( 'access_token', res.access_token, null, '/', document.location.hostname);
                    this.cookieService.set( 'refresh_token', res.refresh_token, null, '/', document.location.hostname);
                }
            }
        ));
    }

    logout() {
        // remove user from local storage & cookies to log user out
        localStorage.removeItem('currentUser');
        this.cookieService.deleteAll();
    }
}