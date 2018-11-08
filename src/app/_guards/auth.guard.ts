import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private cookieService: CookieService, private authenticationService: AuthenticationService,) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //alert('call -- canActive');
        if (localStorage.getItem('currentUser') || this.cookieService.check('refresh_token')) {
            // logged in so return true

            if(!localStorage.getItem('currentUser')) { // REFRESH TOKEN

                this.authenticationService.refresh(this.cookieService.get('refresh_token')).pipe()
                    .subscribe(
                    data => {
                        console.log('call -- refresh token');
                        location.reload(true);
                    },
                    error => {
                        console.log(error);
                        return false;
                });
            }

            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}