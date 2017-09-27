import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LastFmApiService {

  constructor(private _http: Http) { }

  searchTrack(searchVal) {
    console.log('calling last fm api to search tracks by search value');
    return this._http.get('http://ws.audioscrobbler.com/2.0/?method=track.search&track='+ searchVal +'&limit=10&api_key=c595e718d23c51ef68c0d547f1511fe7&format=json')
      .map(response => response.json())
      .toPromise();
  }

  searchAlbum(searchVal) {
    console.log('calling last fm api to search albus by search value');
    return this._http.get('http://ws.audioscrobbler.com/2.0/?method=album.search&album='+ searchVal +'&limit=10&api_key=c595e718d23c51ef68c0d547f1511fe7&format=json')
      .map(response => response.json())
      .toPromise();
  }

  searchArtist(searchVal) {
    console.log('calling last fm api to search artist by search value');
    return this._http.get('http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+ searchVal +'&limit=10&api_key=c595e718d23c51ef68c0d547f1511fe7&format=json')
      .map(response => response.json())
      .toPromise();
  }

  getTopArtist() {
    console.log('calling last fm api to get current top artisst');
    return this._http.get('http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&limit=10&api_key=c595e718d23c51ef68c0d547f1511fe7&format=json')
      .map(response => response.json())
      .toPromise();
  }

  getTopTracks() {
    console.log('calling last fm api to get current top tracks');
    return this._http.get('http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&api_key=c595e718d23c51ef68c0d547f1511fe7&format=json')
      .map(response => response.json())
      .toPromise();
  }

  getAuthSession(token, sig) {
    console.log('calling last fm api to get current top tracks');
    return this._http.get('http://ws.audioscrobbler.com/2.0/?method=auth.getSession&token='+token+'&api_key=c595e718d23c51ef68c0d547f1511fe7&api_sig='+ sig +'&format=json')
      .map(response => response.json())
      .toPromise();
  }

}
