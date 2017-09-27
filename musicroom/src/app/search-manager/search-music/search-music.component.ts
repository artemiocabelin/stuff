import { AppComponent } from './../../app.component';
import { SearchService } from './../../search.service';
import { LastFmApiService } from './../../last-fm-api.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search-music',
  templateUrl: './search-music.component.html',
  styleUrls: ['./search-music.component.css']
})
export class SearchMusicComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subscription2: Subscription;
  searchVal = '';
  trackSearchResults;
  albumSearchResults;
  artistSearchResults;
  constructor(private _route: ActivatedRoute, 
              private _lastFmApiService: LastFmApiService,
              private _searchService: SearchService,
              private _appComponent: AppComponent) {
               }

  ngOnInit() {
        this._appComponent.setIsInMusicBrowser();
        this.subscribeToParams();
        this.subscribeToSearchVal();
  }

  subscribeToParams() {
      this.subscription = this._route.paramMap.subscribe((params: ParamMap) => {
            this.searchVal = params.get('q');
      });
      if (this.searchVal && this.searchVal.length > 0) {
        this.searchMusic(this.searchVal);
      } else {
        this.getTopMusic();
      }
  }

  subscribeToSearchVal() {
    this.subscription2 = this._searchService.searchValueMusic$.subscribe(music => {
      console.log('hiiiii');
      // console.log(search);
      this.searchMusic(music);
    });
  }

  searchMusic(search) {
    if (search) {
      this._lastFmApiService.searchTrack(search)
        .then(data => {
          this.trackSearchResults = data.results.trackmatches.track;
          console.log(this.trackSearchResults);
        })
        .catch(error => {
          console.log(error);
        });

      this._lastFmApiService.searchAlbum(search)
        .then(data => {
          this.albumSearchResults = data.results.albummatches.album;
          console.log(this.albumSearchResults);
        })
        .catch(error => {
          console.log(error);
        });
      this._lastFmApiService.searchArtist(search)
        .then(data => {
          this.artistSearchResults = data.results.artistmatches.artist;
          console.log(this.artistSearchResults);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  getTopMusic() {
    this._lastFmApiService.getTopArtist()
      .then(data => {
        this.artistSearchResults = data;
        console.log(this.artistSearchResults);
      })
      .catch(error => {
        console.log(error);
      });
    this._lastFmApiService.getTopTracks()
      .then(data => {
        this.trackSearchResults = data;
        console.log(this.trackSearchResults);
      })
      .catch(error => {
        console.log(error);
      });
  }

  ngOnDestroy() {
    console.log('search music component destroy');
    this._appComponent.setIsInMusicBrowser();
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
