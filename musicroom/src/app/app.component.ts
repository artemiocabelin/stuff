import { DashboardComponent } from './dashboard/dashboard.component';
import { Subscription } from 'rxjs/Subscription';
import { LastFmApiService } from './last-fm-api.service';
import { ApiCallService } from './api-call.service';
import { SearchManagerComponent } from './search-manager/search-manager.component';
import { SearchService } from './search.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  @ViewChild(DashboardComponent)
  private dashboardComponent: DashboardComponent;

  currentUser;
  stuff;
  msg = "";
  searchVal='';
  searchVal2='';
  searchVal3='';
  isInMusicBrowser = false;
  searchMode = 'users';
  subscription: Subscription;
  subscription2: Subscription;
  constructor(private chatService:ChatService, 
              private _route: Router, 
              private _searchService: SearchService, 
              private _apicallService: ApiCallService,
              private _lastFmApiService: LastFmApiService) {
      // this.getCurrentUserInSession();


   }

   ngAfterViewInit() {

   }

  // sendMsg(msg){
  //    this.chatService.sendMessage(msg);
  // }

  searchUsers() {
    // console.log('hello');
    this._searchService.searchUsers(this.searchVal);
  }

  searchRooms() {
    // console.log('hello');
    this._searchService.searchRooms(this.searchVal3);
  }

  searchMusic() {
    // console.log('hello');
    if (!this.isInMusicBrowser) {
      console.log('not in music browser so redirecting');
      this._route.navigate(['home', 'search', 'results', 'music', { q: this.searchVal2 }]);
      this.searchVal2 = '';
    } else {
      console.log('in music browser so just updating search results');
      this._searchService.searchMusic(this.searchVal2);
      this.searchVal2 = '';
    }
  }

  redirectToSearchPageWithSearchVal() {
    // console.log('redirecting to Search page with keyword SearchVal');
    // console.log(this.searchVal);
    this._route.navigate(['home', 'search', 'results', 'users', { q: this.searchVal }]);
  }

  redirectToSearchRoomPageWithSearchVal3() {
    // console.log('redirecting to Search page with keyword SearchVal');
    // console.log(this.searchVal);
    this._route.navigate(['home', 'search', 'results', 'rooms', { q: this.searchVal3 }]);
  }

  getCurrentUserInSession() {
    this._apicallService.getCurrentUserInSession()
      .then((data) => {
        // console.log(data);
        if (data) {
          // console.log('success getting current user');
          this.currentUser = data;
          this.watchForFriendLoginEvent(this.currentUser._id);
          this.watchForFriendLogoutEvent(this.currentUser._id);
        } else {
          // console.log('user not in session');
          this.currentUser = false;
        }
      })
      .catch((error) => {
        // console.log('error getting current user');
        // console.log(error);
      });
  }

  setIsInMusicBrowser() {
    if (this.isInMusicBrowser) {
      this.isInMusicBrowser = false;
    } else {
      this.isInMusicBrowser = true;
    }
  }

  watchForFriendLoginEvent(id) {
    console.log('Client On: Now Watching for Current User Friends Logging in');
    this.subscription = this.chatService.getLoginEvent(id).subscribe(data => {
      console.log('Login Event Happened');
      // self.dashboardComponent.getCurrentUserInSession();
    });
  }

  watchForFriendLogoutEvent(id) {
    console.log('Client On: Now Watching for Current User Friends Logging out');
    this.subscription2 = this.chatService.getLogoutEvent(id).subscribe(data => {
      console.log('a friend is offline');
      // self.dashboardComponent.getCurrentUserInSession();
    });
  }


  refreshUserSession() {
    this._apicallService.getCurrentUserInSession()
      .then((data) => {
        // console.log(data);
        if (data) {
          // console.log('success getting current user');
          this.currentUser = data;
        } else {
          // console.log('user not in session');
          this.currentUser = false;
        }
      })
      .catch((error) => {
        // console.log('error getting current user');
        // console.log(error);
      });
  }

  ngOnDestroy() {
    // this.emitLogoutEvent(this.currentUser);

    this._apicallService.logoutUser()
      .then(data => {
        console.log(data);
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
      });
  }
  
  // emitLogoutEvent(friendsData) {
  //   console.log('somebody logged in');
  //   this.chatService.logoutEvent(friendsData);
  // }

}
