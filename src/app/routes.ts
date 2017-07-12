import { Routes } from '@angular/router';

import { StreamsComponent } from './streams/streams.component';
import { MessagesComponent } from './messages/messages.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

export const ROUTES: Routes = [
    { path: '', component: StreamsComponent },
    { path: 'messages/:id', component: MessagesComponent },
    { path: 'profile/:id', component: ProfileComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '/404' }
];