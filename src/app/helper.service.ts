import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Common } from './entity/common';
import { Console } from '@angular/core/src/console';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  token: String;
  authorization: String = '';
  response: any = {
    msg: ''
  };

  constructor(
    private http: HttpClient,
    private curl: Common,
    private router: Router,
    private activeRouter: ActivatedRoute,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private spinnerService: Ng4LoadingSpinnerService,
    private restService : RestService
    ) {
  }

  private baseUrl = this.curl.baseurl;

  // Session
  sessionLogin(key) {
    return this.storage.get(key);
  }

   isComponentAllowed(componentName){

      //console.log("world"+this.componentAllowed);
  }

  isAdmin(){

  }
  isDealer(){

  }
  isSDealer(){

  }
  getUserType(){

  }
  getUserId(){

  }
  getAllowedComponents(){

  }

  getAllowedActions(){

  }

}
