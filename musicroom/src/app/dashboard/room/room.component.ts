import { DashboardComponent } from './../dashboard.component';
import { ChatService } from './../../chat.service';
import { ApiCallService } from './../../api-call.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  room;
  message = "";
  userInRoom = false;
  roomPW="";
  constructor(private _route: ActivatedRoute, private apiService: ApiCallService, private chatService: ChatService, private _dashboardComp: DashboardComponent) {
   }

  ngOnInit() {
    // console.log("FFFFF");
    this._route.paramMap.subscribe(params=>{
      var self = this;
      this.apiService.getRoomById(params.get('id')).then(data=>{
        console.log("GOT ROOM");
        console.log(data);
        this.room = data;
        console.log(this.room);
        this.checkUserInRoom();
        this.chatService
        .getMessage(this.room.roomId)
        .subscribe(data => {
          console.log("GOT IT");
          self.refreshRoom();
        });
      })
    })
  }

  refreshRoom(){
    this.apiService.getRoomById(this.room.roomId).then(data=>{
      this.room = data;
      this.checkUserInRoom();
    })
  }

  sendMessage(){
    console.log('SENDING');
    var self = this;
    this.apiService.sendMessage(this.room.roomId, this.message).then(function(data){
      console.log('SENT');
      if(data == false)
        console.log("FALSE");
      else
        self.chatService.sendMessage(self.room.roomId);
      self.message = "";
    });
  }

  checkUserInRoom(){
    this.apiService.getCurrentUserInSession().then(result=>{
      console.log("RESULT");
      console.log(result);
      console.log(this.room._roomMembers[0]);
      console.log(this.room._owner);
      if(this.room._roomMembers.includes(result._id) || this.room._owner == result._id)
        this.userInRoom = true;
      else
        this.userInRoom = false;
      console.log(this.userInRoom);
    })
  }

  joinRoom(){
    var self = this;
    this.apiService.joinRoom(this.room.roomId, this.roomPW).then(function(result){
      self.refreshRoom();
      self._dashboardComp.getCurrentUserInSession();
    });
  }
}
