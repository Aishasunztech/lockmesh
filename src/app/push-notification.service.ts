import { Injectable, Inject, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import { Common } from './entity/common';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Console } from '@angular/core/src/console';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private baseUrl = this.curl.baseurl;
  private socket: SocketIOClient.Socket;
  constructor(
    private http: HttpClient,
    private curl: Common,
    private router: Router,
    private activeRouter: ActivatedRoute,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.socket = io.connect(this.baseUrl.toString());

  }
  onNewMessage(){
    return Observable.create(observer => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }
  sendMessage(){
      this.socket.emit('newMessage', { message: "hello world" });
  }

  onLinkDevice(){

  }

  onUnlinkDevice(){

  }
  onPull(){

  }
  onPush(){

  }
}
