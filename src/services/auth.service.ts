import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private router: Router) { }

  signIn() {
    (<any>window).handleAuthClick();
  }

  logout() {
    (<any>window).GoogleAuth.signOut();
  }
}