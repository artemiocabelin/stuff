import { Subscription } from 'rxjs/Subscription';
import { SearchService } from './../../search.service';
import { ApiCallService } from './../../api-call.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Room } from './../../models/room';
import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-search-rooms',
  templateUrl: './search-rooms.component.html',
  styleUrls: ['./search-rooms.component.css']
})
export class SearchRoomsComponent implements OnInit, OnDestroy {
  searchResults: Room[] = [];
  showSearchResultRooms: Room[] = [];
  subscription: Subscription;
  subscription2: Subscription;
  searchVal = '';
  constructor(private _router: Router, 
    private _route: ActivatedRoute, 
    private _apicallService: ApiCallService, 
    private _searchService: SearchService) {
      this.subscribeToSearchVal();
     }

  ngOnInit() {
    this.subscription2 = this._route.paramMap.subscribe((params: ParamMap) => {
      this.searchVal = params.get('q');
      // console.log(this.searchVal);
    });
    this.getAllRooms(this.searchVal);
  }


  subscribeToSearchVal() {
    this.subscription = this._searchService.searchRoom$.subscribe(search => {
      // console.log('hiiiii');
      // console.log(search);
      this.showSearchResultRooms = this.filterRooms(this.searchResults, search);
    });
  }

  filterRooms(data, val) {
    // console.log('filtering....');
    return data.filter((index) => {
      return index.title.toLowerCase().includes(val.toLowerCase());
    });
  }

  getAllRooms(val){
    this._apicallService.getRooms().then(data => {
      // console.log('success then response getting all users');
      this.searchResults = data;
      this.showSearchResultRooms = this.filterRooms(data, val);
      // console.log(this.showSearchResultUsers);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
