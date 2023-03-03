import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){};

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    let isLoggedIn = this.authService.isAuthenticated();
    return isLoggedIn;
  }  
}
