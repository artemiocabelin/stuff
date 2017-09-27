import { Md5 } from 'ts-md5/dist/md5';
import { LastFmApiService } from './last-fm-api.service';
import { SearchService } from './search.service';
import { ChatService } from './chat.service';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiCallService } from './api-call.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Import FormsModule
import { HttpModule } from '@angular/http'; // <-- Import HttpModule
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LogoutComponent } from './logout/logout.component';
import { SearchManagerComponent } from './search-manager/search-manager.component';
import { RoomComponent } from './dashboard/room/room.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { CurrentProfileComponent } from './profile/current-profile/current-profile.component';
import { SearchMusicComponent } from './search-manager/search-music/search-music.component';
import { SearchUsersComponent } from './search-manager/search-users/search-users.component';
import { SessionHandlerComponent } from './session-handler/session-handler.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { SearchRoomsComponent } from './search-manager/search-rooms/search-rooms.component';

const config: SocketIoConfig = { url: 'http://localhost:8000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    DashboardComponent,
    ProfileComponent,
    LoginComponent,
    RegistrationComponent,
    LogoutComponent,
    SearchManagerComponent,
    RoomComponent,
    OtherUserProfileComponent,
    EditProfileComponent,
    CurrentProfileComponent,
    SearchMusicComponent,
    SearchUsersComponent,
    SessionHandlerComponent,
    NewRoomComponent,
    SearchRoomsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [
    ChatService,
    ApiCallService,
    SearchService,
    LastFmApiService,
    Md5
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
