import { ChatService } from './../chat.service';
import { AppComponent } from './../app.component';
import { Router } from '@angular/router';
import { ApiCallService } from './../api-call.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  currentUser;
  constructor(private _apicallService: ApiCallService, private _router: Router, private _appComponent: AppComponent, private _chatService: ChatService) {
    console.log('get current user session that emits a logout event');
   }

  ngOnInit() {
    this.loggingOut();
  }

  loggingOut() {
    this._apicallService.logoutUser()
      .then(data => {
        console.log('success logging user out refreshing user session');
        this.emitLogoutEvent(data);
        this._appComponent.refreshUserSession();
        this._router.navigate(['']);
      })
      .catch(error => {
        this._router.navigate(['']);
      });
  }

  // getCurrentUserInSession() {
  //   this._apicallService.getCurrentUserInSession()
  //     .then((data) => {
  //       // console.log(data);
  //       if (data) {
  //         console.log('success getting current user emitting logout event');
  //         this.currentUser = data;
  //         this.emitLogoutEvent(this.currentUser);
  //       } else {
  //         console.log('user not in session');
  //       }
  //     })
  //     .catch((error) => {
  //       // console.log('error getting current user');
  //       console.log(error);
  //     });
  // }

  emitLogoutEvent(currentUser) {
    console.log('Client Emitting Logout Event');
    this._chatService.logoutEvent(currentUser);
  }

}
