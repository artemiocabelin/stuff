import { DashboardComponent } from './../dashboard/dashboard.component';
import { ApiCallService } from './../api-call.service';
import { Room } from './../models/room';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.css']
})
export class NewRoomComponent implements OnInit {
  room = new Room();
  constructor(private _apicallService: ApiCallService, private dashComp: DashboardComponent) { }

  ngOnInit() {
  }

  createRoom(){
    var self = this;
    console.log("ROOM");
    console.log(this.room);
    this._apicallService.createRoom(this.room).then(function(data){
      console.log("ROOM CREATION");
      console.log(data);
      self.dashComp.getCurrentUserInSession();
    });
    this.room = new Room();
  }

}
