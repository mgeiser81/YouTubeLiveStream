import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { YoutubeStream } from '../../models/youtube-stream.interface';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit {

  user: any;
  streams: YoutubeStream[];

  constructor(
    private router: Router, 
    private auth: AuthService) { }

  ngOnInit() {
    setTimeout(() => {
      if(!(<any>window).GoogleSignedIn) {
        this.router.navigate(['/']);
      }

      this.getStreams()
        .then(resp => {
          this.streams = resp;
        });
    }, 1000);
  }

  joinChat(stream: YoutubeStream) {
    this.router.navigate(['/messages', stream.chatId]);
  }

  logout() {
    this.auth.logout();
    setTimeout(this.router.navigate(['/login']), 1000);
  }
  
  getStreams() {
    return new Promise<YoutubeStream[]>((resolve, reject) => {
      var request = (<any>window).gapi.client.request({
        'method': 'GET',
        'path': 'youtube/v3/liveBroadcasts',
        'params': {'part': 'status,snippet', 'broadcastStatus': 'all', 'broadcastType': 'all', 'fields': 'etag,eventId,items,kind,nextPageToken,pageInfo,prevPageToken,tokenPagination,visitorId'}
      });
      // Execute the API request.
      request.execute(function(response) {
        var items: YoutubeStream[] = [];
        for (var i = 0; i < response.items.length; i++) {
          var item = response.items[i];
          var snippet = item.snippet;
           var status = item.status;
           items.push({
            id: item.id, 
            chatId: snippet.liveChatId,
            title: snippet.title,
            recordingStatus: status.recordingStatus
           });
        }
        resolve(items);
      });
    });
  }
}