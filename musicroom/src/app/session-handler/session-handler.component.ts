import { Md5 } from 'ts-md5/dist/md5';
import { ApiCallService } from './../api-call.service';
import { LastFmApiService } from './../last-fm-api.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'app-session-handler',
  templateUrl: './session-handler.component.html',
  styleUrls: ['./session-handler.component.css']
})
export class SessionHandlerComponent implements OnInit, OnDestroy {
  authToken;
  apiSig;
  lastFmSessionToken;
  lastFmSessionSig;
  subscription: Subscription;
  constructor(private _route: Router, 
              private _lastfmApiService: LastFmApiService,
              private _apiCallService: ApiCallService,
              private _md5: Md5) {
    this.subscription = this._route.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        const params = new URLSearchParams(data.url.split('?')[1]);
        this.authToken = params.get('token');
        console.log(this.authToken);
        this.apiSig = this.hashIntoApiSig(this.authToken);
        console.log(this.apiSig);
        this.fetchLastFmSessionToken(this.authToken, this.apiSig);
        console.log(this.lastFmSessionToken);
        this._route.navigate(['/home']);
      }
    });
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hashIntoApiSig(token) {
    const apikey = 'c595e718d23c51ef68c0d547f1511fe7';
    const apisecret = 'e66072ab2029e8df10acdf1845093b59';
    const hash = this._md5.appendStr('api_key' + apikey + 'methodauth.getSessiontoken' + token + apisecret).end();
    return hash;
  }

  fetchLastFmSessionToken(authToken, apiSig) {
    this._lastfmApiService.getAuthSession(authToken, apiSig)
      .then(data => {
        console.log('then response fetchLastFmSessionToken');
        console.log(data);
        this.lastFmSessionToken = data.session.key;
        this.lastFmSessionSig = this.hashIntoApiSig(this.lastFmSessionToken);
        this.saveLastFmSessionTokenAndSigToUserInSession(this.lastFmSessionToken, this.lastFmSessionSig);
      })
      .catch(error => {
        console.log(error);
      });
  }

  saveLastFmSessionTokenAndSigToUserInSession(lastFmSessionT, lastFMSessionS) {
    const lastFmSessionData = { lastFmSession: lastFmSessionT, lastFmSessionSig: lastFMSessionS};
    this._apiCallService.saveLastFmSessionTokenAndSigToUserInSession(lastFmSessionData)
      .then(data => {
        console.log('then response saveLastFmSessionTokenAndSigToUserInSession');
        console.log(data);
        if(data) {
          this._route.navigate(['home']);
        } else {
          console.log('error adding token to currentUser');
          this._apiCallService.logoutUser();
          this._route.navigate(['']);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
 
}
