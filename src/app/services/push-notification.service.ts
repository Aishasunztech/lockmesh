import { Injectable, Inject, OnInit} from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Common } from '../entity/common';
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
  private socket:SocketIOClient.Socket;
  token: String;
  device_id: String;
  query: String;

  constructor(
    private curl: Common,
    private router: Router,
    private activeRouter: ActivatedRoute,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private spinnerService: Ng4LoadingSpinnerService
    ) {
      console.log('socket constructor');
  }
  

  connect(device_id){
    this.token = this.sessionKey("token");
    this.device_id = device_id;
    console.log("device_id: "+ device_id);
    let makeToken = "token=" + this.token + "&device_id=" + this.device_id + "&isWeb=true";
    console.log("token query: " + makeToken);
    
    this.socket = socketIo.connect(this.baseUrl.toString(), { 
      query: makeToken,
      reconnectionDelay:1000,
      reconnection:true,
      forceNew:true
    });
    
    console.log(this.socket);
    
  }

  reconnect(){
    console.log('reconnecting');
  }

  sessionKey(key) {
    return this.storage.get(key);
  }

  
  onGetApps(){
    return Observable.create(observer => {
      this.socket.on('get_sync_status_' + this.device_id, data => {
        console.log('request respond: ' + this.device_id);
        observer.next(data);
      });
    });
  }
  connnections(){
    this.socket.on("disconnect",function(){
      console.log("disconnected");
    });
  }
  // public onEvent(event: Event): Observable<any> {
  //   return new Observable<Event>(observer => {
  //     this.socket.on(event, () => {
  //       observer.next()
  //     });
  //   });
  // }
  onLinkDevice(){

  }

  onUnlinkDevice(){

  }
  onPull(){

  }
  onPush(){

  }
  
  bind_socket(){
    
  }
  disconnect(){
    // this.socket.off();
    // this.socket.disconnect();
  }
}
