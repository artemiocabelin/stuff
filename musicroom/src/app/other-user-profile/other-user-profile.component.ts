import { ChatService } from './../chat.service';
import { User } from './../models/user';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiCallService } from './../api-call.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.css']
})
export class OtherUserProfileComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  user: User;
  currentUser: User;
  constructor(private _apicallService: ApiCallService, private _route: ActivatedRoute, private _router: Router, private chatService: ChatService) {
    this.getCurrentUserInSession();
    this.subscribeToUserIdParams();
   }

  ngOnInit() {
    this.getCurrentUserInSession();
  }

  subscribeToUserIdParams() {
    this.subscription = this._route.paramMap
      .switchMap(params => {
        // console.log('got params id: ' + params.get('id'));
        return this._apicallService.getUserByUserId(params.get('id'));
    }).subscribe(user => {
      this.user = user;
      // console.log(this.user);
    });
  }

  getCurrentUserInSession() {
    this._apicallService.getCurrentUserInSession()
      .then((data) => {
        // console.log(data);
        if (data) {
          // console.log('success getting current user');
          this.currentUser = data;
        } else {
          // console.log('user not in session');
          this._router.navigate(['']);
        }
      })
      .catch((error) => {
        // console.log('error getting current user');
        // console.log(error);
        this._router.navigate(['']);
      });
  }

  sendInvite(userId) {
    const user_Id = {userId: userId};
    this._apicallService.sendInviteToUserById(user_Id)
      .then(data => {
        // console.log('sucess then response sendInvite');
        // console.log(data);
        this.subscribeToUserIdParams();

      })
      .catch(error => {
        // console.log('error catch response sendInvite');
      });
  }

  isFriendOfCurrentUser(userFriends) {
    // console.log(this.currentUser._id);
    // console.log(userFriends);
    const friend = userFriends.find(index => {
      return index === this.currentUser._id;
    });
    // console.log(friend);
    if (friend) { return true; }
    return false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
