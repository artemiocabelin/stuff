import { ApiCallService } from './../api-call.service';
import { User } from './../models/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user: User = new User();
  isDuplicate = false;
  constructor(private _apicallService: ApiCallService, private _router: Router) {
    // console.log('hellooo registrations!!');
   }

  ngOnInit() {
  }

  registerUser() {
    // console.log('registering User');
    // console.log(this.user);
    this._apicallService.registerAUser(this.user)
      .then((data) => {
        // console.log(data);
        if (data.code) {
          // console.log(data.code);
          if (data.code === 11000) {
            // console.log('duplicate data please try again');
            this.isDuplicate = true;
          }
          this.user = new User();
        } else {
          // console.log('success registering user');
          this.isDuplicate = false;
          this.user = new User();
          this._router.navigate(['/login']);
        }
      })
      .catch((error) => {
        console.log('error registering user');
        console.log(error);
      });
  }

}
