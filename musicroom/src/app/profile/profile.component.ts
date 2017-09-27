import { User } from './../models/user';
import { Router } from '@angular/router';
import { ApiCallService } from './../api-call.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User;
  constructor(private _apicallService: ApiCallService, private _router: Router) {
    this.getCurrentUserInSession();
   }

  ngOnInit() {
  }

  getCurrentUserInSession() {
    this._apicallService.getCurrentUserInSession()
      .then((data) => {
        // console.log(data);
        if (data) {
          // console.log('success getting current user');
          this.currentUser = data;
          // console.log(this.currentUser);
        } else {
          // console.log('user not in session');
          this._router.navigate(['']);
        }
      })
      .catch((error) => {
        // console.log('error getting current user');
        console.log(error);
        this._router.navigate(['']);
      });
  }

  acceptInvite(invite_id) {
    // console.log('controller accepting invite');
    const receivedInvites = this.currentUser.received_invites;
    for (const invite of receivedInvites) {
      if (invite._id === invite_id) {
        // console.log('found invite');
        const inviteId = { inviteId : invite_id };
        this._apicallService.addFriendAndUpdateReceivedInvite(inviteId)
          .then(data => {
            // console.log('then response addFriendAndUpdateReceivedInvite');
            // console.log(data);
            this.getCurrentUserInSession();
          })
          .catch(error => {
            // console.log('catch response addFriendAndUpdateReceivedInvite');
            // console.log(error);
          });
      }
    }
  }

  rejectInvite(invite_id) {
    // console.log('controller rejecting invite');
    const receivedInvites = this.currentUser.received_invites;
    for (const invite of receivedInvites) {
      if (invite._id === invite_id) {
        // console.log('found invite');
        const inviteId = { inviteId : invite_id };
        this._apicallService.rejectInvite(inviteId)
          .then(data => {
            // console.log('then response rejectInvite');
            // console.log(data);
            this.getCurrentUserInSession();
          })
          .catch(error => {
            console.log('catch response rejectInvite');
            console.log(error);
          });
      }
    }
  }

  removeFriend(friend_id) {
    // console.log('controller removing friend');
    const friendList = this.currentUser.friends;
    for (const friend of friendList) {
      if (friend._id === friend_id) {
        // console.log('found invite');
        const friendId = { friendId : friend_id };
        this._apicallService.removeFriend(friendId)
          .then(data => {
            // console.log('then response removeFriend');
            // console.log(data);
            this.getCurrentUserInSession();
          })
          .catch(error => {
            console.log('catch response removeFriend');
            console.log(error);
          });
      }
    }
  }

}
