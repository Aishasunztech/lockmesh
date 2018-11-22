import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestMethod, Jsonp } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Common } from '../entity/common';
import { Console } from '@angular/core/src/console';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Injectable({
  providedIn: 'root'
})
export class ApkService {
  token: String;
  response: any = {
    msg: ''
  };
  constructor(
    private http: HttpClient,
    private curl: Common,
    private router: Router,
    private activeRouter: ActivatedRoute, @Inject(LOCAL_STORAGE) private storage: WebStorageService,
     private spinnerService: Ng4LoadingSpinnerService) {
  }
  private baseUrl = this.curl.baseurl;

  // Session
  sessionLogin(key) {
    return this.storage.get(key);
  }
  // for authentication token
  authtoken(response) {
    console.log(response);
    if (response.success === false && response.message === 'Failed to authenticate token.') {
      Swal({
        text: response.message,
        type: 'error',
        customClass: 'swal-height'
          }).then(okay => {
            this.router.navigate(['/login']);
        });
    }

  }
  // Get APK List
  getApkListApk() {
    this.token = this.sessionLogin('token');
      const header = new HttpHeaders();
      header.append('authorization', this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/apklist', {headers: { 'authorization': this.sessionLogin('token')} });
    this.authtoken(this.response);
      return this.response;
  }
    // Get Logo List
    getLogolist(logo) {
      this.token = this.sessionLogin('token');
        const header = new HttpHeaders();
        header.append('authorization', this.sessionLogin('token'));
      this.response = this.http.get(this.baseUrl + '/users/getFile' + logo,
      {headers: { 'authorization': this.sessionLogin('token')} });
      this.authtoken(this.response);
        return this.response;
    }

  // Uploading Apk
  uploadApk(name, logoF, apkF) {
    this.token = this.sessionLogin('token');
      const header = new HttpHeaders();
      header.append('authorization', this.sessionLogin('token'));
      const formData: FormData = new FormData();
      formData.append('logo', logoF);
      formData.append('apk', apkF);
      formData.append('name', name);
    this.response = this.http.post(this.baseUrl + '/users/upload', formData, {headers: { 'authorization': this.sessionLogin('token')} });
    this.authtoken(this.response);
      return this.response;
  }

  toggleApk(data) {
    this.token = this.sessionLogin('token');
      const header = new HttpHeaders();
      header.append('authorization', this.sessionLogin('token'));
    this.response = this.http.post(this.baseUrl + '/users/toggle', data, {headers: { 'authorization': this.sessionLogin('token')} });
    this.authtoken(this.response);
      return this.response;
  }
}
