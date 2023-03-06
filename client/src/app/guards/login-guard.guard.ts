import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let isLoggedOut = !this.authService.isAuthenticated();
    if (!isLoggedOut) {
      this.router.navigate(['/home']);
    }
    return isLoggedOut;
  }
}
