import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  
  //private authSub$: Subscription;
  user: any = null;
  apiKey: string;
  loggedIn: boolean = false;

  constructor(private auth: AuthService, private router: Router) {
    
  }

  signOff() {
    this.auth.logout();
  }

  ngOnDestroy() {
    
  }
}