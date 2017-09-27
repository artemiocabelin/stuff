import { SearchService } from './../../search.service';
import { ApiCallService } from './../../api-call.service';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../models/user';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit, OnDestroy, AfterViewInit  {
  searchResults: User[] = [];
  showSearchResultUsers: User[] = [];
  subscription: Subscription;
  subscription2: Subscription;
  searchVal = '';
  currentUser: User;
  constructor( private _router: Router, 
              private _route: ActivatedRoute, 
              private _apicallService: ApiCallService, 
              private _searchService: SearchService) {
    this.getCurrentUserInSession();
    this.subscribeToSearchVal();
   }

  ngOnInit() {
    this.subscription2 = this._route.paramMap.subscribe((params: ParamMap) => {
        this.searchVal = params.get('q');
        // console.log(this.searchVal);
      });
    this.getAllUsers(this.searchVal);

  }

  subscribeToSearchVal() {
    this.subscription = this._searchService.searchValue$.subscribe(search => {
      // console.log('hiiiii');
      // console.log(search);
      this.showSearchResultUsers = this.filterUsers(this.searchResults, search);
    });
  }

  getAllUsers(search) {
    if (!search) {
      search = '';
    }
    this._apicallService.getAllUsers()
      .then(data => {
        // console.log('success then response getting all users');
        this.searchResults = data;
        this.showSearchResultUsers = this.filterUsers(data, search);
        // console.log(this.showSearchResultUsers);
      })
      .catch(error => {
        // console.log('error catch response getting all users');
        // console.log(error);
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

  filterUsers(data, val) {
    // console.log('filtering....');
    return data.filter((index) => {
      return index.username.toLowerCase().includes(val.toLowerCase()) || index.firstName.toLowerCase().includes(val.toLowerCase()) || index.lastName.toLowerCase().includes(val.toLowerCase());
    });
  }


  sendInvite(userId) {
    const user_Id = {userId: userId};
    this._apicallService.sendInviteToUserById(user_Id)
      .then(data => {
        // console.log('sucess then response sendInvite');
        // console.log(data);
        this.getAllUsers(this.searchVal);
      })
      .catch(error => {
        // console.log('error catch response sendInvite');
      });
  }

  isFriendOfCurrentUser(userFriends) {
    const friend = userFriends.find(index => {
      return index._id === this.currentUser._id;
    });
    // console.log(friend);
    if (friend) { return true; }
    return false;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
