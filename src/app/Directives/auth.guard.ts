import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../Services/users/authentication.service';
//import { AuthenticationService } from '../Services/users/authentication.service';
//import { AuthenticationService } from '../Services/users/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate, CanLoad {
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  canActivate() {
      if (sessionStorage.getItem('userActual')) {
          this.IsTokenExpired();
          return true;
      }
      this.router.navigate(['/login']);
      return false;
  }

  private IsTokenExpired() {
      const user = JSON.parse(sessionStorage.getItem('userActual')!);
      if (!user || user == null) {
          //this.authenticationService.logout();
      }
      const token = user.token;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const data = JSON.parse(window.atob(base64));
      if ((Date.now() / 1000) > data.exp) {
          //this.authenticationService.logout();
      }
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      //console.log('canLoad', true)
      //console.log(route)
      //console.log(segments)
    return true;
  }
}
