// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../modules/auth/services/auth.service';
@Injectable({
    providedIn: 'root'
  })
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    const user = this.auth.getUser();
    console.log(user)
    if(!user) {
        this.router.navigate(['/', 'auth','login']);
        return false;
    }
    return true;
  }
}