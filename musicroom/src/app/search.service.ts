import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class SearchService {

  constructor() { }
 // Observable string sources
  private searchValueSource = new BehaviorSubject<string>('');
  private searchValueMusicSource = new BehaviorSubject<string>('');
  private searchRoomSource = new BehaviorSubject<string>('');
 
  // Observable string streams
  searchValue$ = this.searchValueSource.asObservable();
  searchRoom$ = this.searchRoomSource.asObservable();
  searchValueMusic$ = this.searchValueMusicSource.asObservable();
  
  // Service message commands
  searchUsers(searchVal: string) {
    this.searchValueSource.next(searchVal);
  }
  searchRooms(searchVal: string) {
    this.searchRoomSource.next(searchVal);
  }
  searchMusic(searchVal: string) {
    this.searchValueMusicSource.next(searchVal);
  }

 
}
