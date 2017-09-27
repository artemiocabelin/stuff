import { ChatService } from './../chat.service';
import { AppComponent } from './../app.component';
import { Router } from '@angular/router';
import { ApiCallService } from './../api-call.service';
import { User } from './../models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = new User();
  currentUser: User;
  incorrectLogin = false;
  // currentUser;
  constructor(private _apicallService: ApiCallService, 
              private _router: Router, 
              private _appComponent: AppComponent,
              private _chatService: ChatService) { }

  ngOnInit() {
  }

  loginUser() {
    this._apicallService.loginUser(this.user)
      .then((data) => {
        if (!data) {
          this.incorrectLogin = true;
          this.user = new User();
        } else {
          this.incorrectLogin = false;
          this._appComponent.getCurrentUserInSession();
          this.getCurrentUserInSession();
          this._router.navigate(['home']);
          // }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  getCurrentUserInSession() {
    this._apicallService.getCurrentUserInSession()
      .then((data) => {
        if (data) {
          this.currentUser = data;
          this.emitLoginEvent(this.currentUser);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  emitLoginEvent(friendsData) {
    console.log('emitLoginEvent');
    this._chatService.loginEvent(friendsData);
  }
}
