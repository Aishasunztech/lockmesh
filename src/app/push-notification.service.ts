import { Injectable, Inject, OnInit} from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Common } from './entity/common';
import { Event } from './entity/event';
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
    private http: HttpClient,
    private curl: Common,
    private router: Router,
    private activeRouter: ActivatedRoute,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private spinnerService: Ng4LoadingSpinnerService) {
    // this.socket = socketIo();
    // console.log("loging socket object");
    // console.log(this.socket);
  }
  
  async connect(device_id){
    this.token = this.sessionLogin("token");
    this.device_id = device_id;
    console.log("device_id: "+ device_id);
    let makeToken = "token=" + this.token + "&device_id=" + this.device_id + "&isWeb=true";
    console.log("token query: " + makeToken);
    
    this.socket = await socketIo.connect(this.baseUrl.toString(), { query: makeToken });
    
    console.log(this.socket);
    
  }

  reconnect(){
    console.log('reconnecting');
    this.connect(this.device_id);
  }

  sessionLogin(key) {
    return this.storage.get(key);
  }

  onRequestApps(){
    console.log("requesting application for: "+ this.device_id);
    
    this.socket.emit('requestApps_'+ this.device_id,{
      device_id:this.device_id
    });
    
  }
  
  onGetApps(){
    console.log("start getting apps");
    console.log(this.device_id);
    return Observable.create(observer => {
      this.socket.on('sendApps_' + this.device_id, data => {
        console.log('request respond: ' + this.device_id);
        observer.next(data);
      });
    });
  }
  
  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => {
        observer.next()
      });
    });
  }
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
