import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';
import { YoutubeMessage } from '../../models/youtube-message.interface';
import { YoutubeUser } from '../../models/youtube-user.interface';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  chatId: string;
  scrollTop: number = 0;
  users: FirebaseListObservable<any>;
  messages: FirebaseListObservable<any>;
  fetchInterval: any;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private zone: NgZone,
    private auth: AuthService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    setTimeout(() => {
      if(!(<any>window).GoogleSignedIn) {
        this.router.navigate(['/']);
      }

      this.activatedRoute.params.subscribe((params: Params) => {
        this.chatId = params['id'];
        this.setupDataListener();
        
        this.fetchInterval = window.setInterval(() => {
          this.executedResults()
            .then(results => {
              for (var m in results) {
                var item = results[m];
                this.saveChatUser(item.user);
                this.saveChatMessage(item);
                this.saveUserMessage(item);
              }

              (<any>window).GoogleIsFetching = false;
            })
            .catch(() => {});
        }, 2000);
        
      });
    }, 1000);
  }

  ngOnDestroy() {
    window.clearInterval(this.fetchInterval);
  }

  setupDataListener() {
    this.users = this.db.list(`liveChat/${this.chatId}/users`);
    this.messages = this.db.list(`liveChat/${this.chatId}/messages`, {
      query: {
        orderByChild: 'dateAdded'
      }
    });
  }

  backToStreams() {
    this.router.navigate(['/']);
  }

  logout() {
    this.auth.logout();
    setTimeout(this.router.navigate(['/login']), 1000);
  }

  viewProfile(user: YoutubeUser) {
    this.router.navigate(['/profile', user.channelId]);
  }

  executedResults() {
    return new Promise<any>((resolve, reject) => {
      if ((<any>window).GoogleIsFetching) {
        reject();
      } 

      (<any>window).GoogleIsFetching = true;
      var request = (<any>window).gapi.client.request({
          'method': 'GET',
          'path': 'youtube/v3/liveChat/messages',
          'params': {'liveChatId': this.chatId, 'part': 'id,snippet,authorDetails'}
        });
        request.execute(function(response) {
          var items = [];

          if (response.items && response.items.length > 0) {
            for (var i = 0; i < response.items.length; i++) {
              var item = response.items[i];

              var user = {
                channelId: item.authorDetails.channelId,
                channelUrl: item.authorDetails.channelUrl,
                name: item.authorDetails.displayName,
                image: item.authorDetails.profileImageUrl,
                isOwner: item.authorDetails.isChatOwner
              };

              var publishedAt = item.snippet.publishedAt ? new Date(Date.parse(item.snippet.publishedAt)) : new Date();

              var message = {
                id: item.id.replace('.', ''),
                type: item.snippet.type,
                chatId: item.snippet.liveChatId,
                authorChannelId: item.authorDetails.channelId,
                authorName: item.authorDetails.displayName,
                authorImage: item.authorDetails.profileImageUrl,
                isOwner: item.authorDetails.isChatOwner,
                text: item.snippet.textMessageDetails.messageText,
                dateAdded: publishedAt.getTime(),
                user: user
              };
              items.push(message);
            }
          }

          resolve(items);
        });
    });
  }

  saveChatMessage(message: any) {
    var ref = this.db.database.ref(`liveChat/${this.chatId}/messages/${message.id}`);
    ref.set({
      id: message.id,
      type: message.type,
      chatId: message.chatId,
      authorChannelId: message.authorChannelId,
      authorName: message.authorName,
      authorImage: message.authorImage,
      isOwner: message.isOwner,
      text: message.text,
      dateAdded: message.dateAdded
    });
  }

  saveChatUser(user: any) {
    var ref = this.db.database.ref(`liveChat/${this.chatId}/users/${user.channelId}`);
    ref.set(user);
  }

  saveUserMessage(message: any) {
    var ref = this.db.database.ref(`liveChatUserMessages/${message.user.channelId}/user`);
    ref.set(message.user);
    var ref2 = this.db.database.ref(`liveChatUserMessages/${message.user.channelId}/messages/${message.id}`);
    ref2.set({
      id: message.id,
      type: message.type,
      chatId: message.chatId,
      authorChannelId: message.authorChannelId,
      authorName: message.authorName,
      authorImage: message.authorImage,
      isOwner: message.isOwner,
      text: message.text,
      dateAdded: message.dateAdded
    });
  }
}