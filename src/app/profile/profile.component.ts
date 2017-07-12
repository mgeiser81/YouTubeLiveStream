import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { YoutubeMessage } from '../../models/youtube-message.interface';
import { YoutubeUser } from '../../models/youtube-user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  channelId: string;
  profile: YoutubeUser;
  messages: YoutubeMessage[];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private location: Location,
    private auth: AuthService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    setTimeout(() => {
      if(!(<any>window).GoogleSignedIn) {
        this.router.navigate(['/']);
      }

      this.activatedRoute.params.subscribe((params: Params) => {
        this.channelId = params['id'];
        
        this.fetchUser(params['id'])
        .then(user => {
          this.profile = user;
          this.fetchMessages();
        })
        .catch(err => {
          console.error(err);
        });
      });
    }, 1000);
  }

  logout() {
    this.auth.logout();
    setTimeout(this.router.navigate(['/login']), 1000);
  }

  backToMessages() {
    this.location.back();
  }

  backToStreams() {
    this.router.navigate(['/']);
  }

  async fetchUser(key: string): Promise<any> { 
    return new Promise((resolve, reject) => {
      this.db.object(`liveChatUserMessages/${this.channelId}/user`).subscribe(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }

  async fetchMessages() {
    this.db.list(`liveChatUserMessages/${this.channelId}/messages`).subscribe(snap => {
      this.messages = snap;
    });
  }
}