import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLeaving: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      if((<any>window).GoogleSignedIn) {
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.isLeaving = true;
  }

  async login() {
    const loaded = (<any>window).GoogleLoaded;
    if (!loaded) {
      alert('Page not ready yet');
      return;
    }
    this.auth.signIn();
    setTimeout(() => this.checkLogin(), 2000);
  }

  /*
  TODO: this is a bit of a hack to access stuff on the index, a cleaner method is available if more time was a lotted. Will be infinite loop until page is destroyed if no login is completed.
  */
  checkLogin() {
    setTimeout(() => {
      if (this.isLeaving) return;

      if ((<any>window).GoogleSignedIn) {
        this.router.navigate(['/']);
      } else {
        this.checkLogin();
      }
    }, 2000);
  }
}