import { ChatService } from './../chat.service';
import { Subscription } from 'rxjs/Subscription';
import { Room } from './../models/room';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from './../models/user';
import { ApiCallService } from './../api-call.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User = new User();
  allRooms = [];
  userRooms = [];
  room:object={};
  constructor(private _apicallService: ApiCallService, private _router: Router, private chatService: ChatService) {
    this.getCurrentUserInSession();
   }
  ngOnInit() {
    var self = this;
    this.getAllRooms();
    // this.chatService
    // .getMessage(this.room.roomId)
    // .subscribe(data => {
    //   console.log("GOT IT");
    //   self.getCurrentUserInSession();
    // });
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


  getAllRooms(){
    this._apicallService.getRooms().then(rooms=>{
      this.allRooms = rooms;
    })
  }


}
