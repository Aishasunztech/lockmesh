import { Component, OnInit, Inject, } from '@angular/core';
import { RestService } from '../../rest.service';
// import { PushNotificationService } from '../../push-notification.service';
import Swal from 'sweetalert2';
// import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router, ActivatedRoute} from '@angular/router';
import { Common } from '../../entity/common';
import * as io from "socket.io-client";

// import { Event } from '../../entity/event';
// import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';

@Component({
  selector: 'app-connect-devices',
  templateUrl: './connect-devices.component.html',
  styleUrls: ['./connect-devices.component.css']
})
export class ConnectAdminDevicesComponent implements OnInit {
  path: any;
  private resp: any = null;
  device_data = {
    account_status: '',
    client_id: '',
    device_id: '',
    email: '',
    expiry_date: '',
    imei: '',
    ip_address: '',
    mac_address: '',
    model: '',
    name: '',
    s_dealer_name: '',
    serial_number: '',
    simno: '',
    start_date: '',
    status: '',
    is_sync:''
  };
  pageName = "main_menu";

  appList = [];
  passwords = {
    admin_password:null,
    guest_password:null,
    encrypted_password:null
  };
  device_setting = {
    guest: false,
    encrypted: false,
    enable: false
  };
  device_controls = [];
  
  stackedApps=[];
  redoStackedApps = [];

  changedSettings = {
    guest: false,
    encrypted: false,
    enable: false
  };
  appStackTop=1;
  stackControls = [];
  redoStackControls = [];
  
  baseUrl = this.common.baseurl;
  private sockets;
  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
    private spinnerService: Ng4LoadingSpinnerService,
    private common: Common
    // private sockets:PushNotificationService
  ) {
    
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.path = this.router.url.split('/');
    var device_id = this.path[2];
    
    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });

    this.restService.getDeviceApps(device_id).subscribe((response) => {
      this.appList = response;
      this.stackedApps.push(this.copyObject(response));
      console.log("stack length: " + this.stackedApps.length);

      console.log("stack apps");
      console.log(this.stackedApps);

      this.spinnerService.hide();
      this.restService.authtoken(response);
    });

    let token = window.localStorage.getItem('token');

    let makeToken = "token=" + token + "&device_id=" + device_id + "&isWeb=true";
    console.log("token query: " + makeToken);

    this.sockets = io.connect(this.baseUrl.toString(), {
      query: makeToken,
      reconnectionDelay: 1000,
      reconnection: true,
      forceNew: true
    });
    console.log("get_sync_status_"+ device_id);
    this.sockets.on('get_sync_status_' + device_id, (data) => {
      this.refresh(device_id);
      // this.todos.push(data.todo);
    });
    
  }

  
  ngAfterViewInit() {
    console.log("ngAfterViewInit");

    // this.path = this.router.url.split('/');
    // var device_id = this.path[2];
    
    // console.log(this.sockets);

    // this.sockets.connect

    // this.sockets.onGetApps().subscribe((resp) => {
    //   console.log("get Applications response");
    //   if (resp.refresh_data == true) {
    //     // this.refresh(resp.deivce_id);
    //   }
    // });  
    // this.sockets.connnections();
  }
  
  // refresh button
  refresh(device_id) {
    console.log("refresh click");
    
    device_id = this.route.snapshot.paramMap.get('device_id');
    
    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
    console.log(this.device_data);

    this.emptyStack();
    
    this.restService.getDeviceApps(device_id).subscribe((response) => {
      this.appList = response;
    
      this.stackedApps.push(this.copyObject(response));
      console.log("stack length: "+ this.stackedApps.length);
      console.log("stack apps");
      console.log(this.stackedApps);
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
  }
  
  changePage(pageName,event){
    this.pageName=pageName;
  }

  unlinkUser(device_id) {
    Swal({
      text: 'Are you sure to unlink the device?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((result) => {
      this.spinnerService.show();
      if (result) {
        this.restService.unlinkUser(device_id);
        this.spinnerService.hide();
        this.router.navigate(['/devices']);
      }
    });
  }

  suspendForm(device_id) {
    Swal({
      text: 'Are you sure to suspend the device?',
      showCancelButton: true,
      useRejections: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((okay) =>  {
      if (okay) {
        // location.reload(true);
        this.spinnerService.show();
        this.restService.suspendForm(device_id).subscribe((response) => {
       //   this.spinnerService.hide();
          this.restService.authtoken(response);
          this.resp = response;
          if (this.resp.status === true) {
            Swal({
            text: this.resp.msg,
            type: 'success',
              customClass: 'swal-height'
              }).then(result => {
              if (result.value) {
                this.router.navigate(['/devices']);
                }
              });
          } else {
            if (this.resp.status === false) {
              Swal({
              text: this.resp.msg,
              type: 'warning',
                customClass: 'swal-height'
                }).then(result => {
                if (result.value) {
                  location.reload(false);
                  }
                });
            }
          }
        });
        this.spinnerService.hide();
      }
    });
  }

  ngOnChanges(){
    console.log("ngOnChanges");
  }

  checkApps(event,app=null){
    // console.log("check apps");
    // console.log(this.appList);

    var name = event.target.name;
    var value = event.target.value;
    var checked = event.target.checked;
    var className = event.target.attributes.class.nodeValue;
    var id = event.target.attributes.id;
    if(id!=undefined){
      id=id.nodeValue;
    }

    if(name == "check_all"){

      
      
      if(checked==true){
        if(value == "enable_all"){
          $('.enabled').prop('checked',true);
          this.setSelectAll('enable',1);
        }else if(value == "on_encrypted"){
          $('.encrypted').prop('checked', true);
          this.setSelectAll('encrypted', 1);

        }else if(value == "on_guest"){
          $('.guest').prop('checked', true);
          this.setSelectAll('guest', 1);

        }
      }else{
        if (value == "enable_all") {
          $('.enabled').prop('checked', false);
          this.setSelectAll('enable', 0);

        } else if (value == "on_encrypted") {
          $('.encrypted').prop('checked', false);
          this.setSelectAll('encrypted', 0);

        } else if (value == "on_guest") {
          $('.guest').prop('checked', false);
          this.setSelectAll('guest', 0);

        }
      }
      this.appList.forEach((elem) => {
        if (elem.isChanged == undefined) {
          elem.isChanged = 1;
        }
      });

      this.stackedApps.push(this.copyObject(this.appList));

      console.log("on select/unselect all");
      console.log(this.stackedApps);
    }else if(id=="apps"){
      if(app!=null){
        let appIndex =this.getAppIndex(this.appList,app.uniqueName);
        
        if(this.appList[appIndex].isChanged==undefined){
          this.appList[appIndex].isChanged=1;
        }

        if (className == "guest" && checked == false) {
          $('.on_guest').prop('checked', false);
          this.appList[appIndex].guest=0;
        }else if(className == "guest" && checked ==true){
          this.appList[appIndex].guest=1;
        }

        if (className == "encrypted" && checked == false) {
          $('.on_encrypted').prop('checked', false);
          this.appList[appIndex].encrypted=0;
        }else if(className == "encrypted" && checked == true){
          this.appList[appIndex].encrypted=1;
        }

        if (className == "enabled" && checked == false) {
          $('.enable_all').prop('checked', false);
          this.appList[appIndex].enable=0;
        }else if(className == "enabled" && checked == true){
          this.appList[appIndex].enable=1;
        }
        // console.log(this.appList);

        this.stackedApps.push(JSON.parse(JSON.stringify(this.appList)));
        // this.appStackTop++;

        console.log(this.stackedApps);
      }else{
        if (className == "guest" && checked == false) {
          $('.on_guest').prop('checked', false);
        }

        if (className == "encrypted" && checked == false) {
          $('.on_encrypted').prop('checked', false);
        }

        if (className == "enabled" && checked == false) {
          $('.enable_all').prop('checked', false);
        }
      }
    }
  }
  setSelectAll(key,value){
    this.appList.forEach((elem)=>{
      elem[key]=value
    });
  }

  applySettings(event){
    console.log("apply settings");
    console.log("stack apps");
    console.log(this.stackedApps);
    if(this.stackedApps.length>1){
      let app_list = this.getChangedApps(this.stackedApps[this.stackedApps.length -1]);
      console.log("app_list");
      console.log(app_list);

      let device_setting ={
        app_list: app_list
      };
      this.restService.applySettings(device_setting,this.device_data.device_id);
      this.clearStack();
    }
  }
  clearStack(){
    this.stackedApps = [];
    this.redoStackedApps = [];
    this.stackedApps.push(this.copyObject(this.appList));
  }
  emptyStack(){
    this.stackedApps = [];
    this.redoStackedApps = [];
  }
  getChangedApps(apps){
    let retApps=[];
    
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].isChanged!=undefined){
        retApps.push(JSON.parse(JSON.stringify(apps[i])));
      }
    }
    return retApps;
  }
  undoSettings(event){
    if (this.stackedApps.length>1) {
      
      console.log("stack length: " + this.stackedApps.length);
      console.log(this.stackedApps);

      let apps=this.stackedApps[this.stackedApps.length -1];
      this.stackedApps.pop();

      console.log("stack length: " + this.stackedApps.length);
      this.appList=JSON.parse(JSON.stringify(this.stackedApps[this.stackedApps.length -1]));
      console.log(this.stackedApps);
      console.log("apps");
      console.log(this.appList);
      this.redoStackedApps.push(apps);
    
    }
    
  }
  copyObject(obj){
    return JSON.parse(JSON.stringify(obj));
  }
  redoSettings(event){
    if(this.redoStackedApps.length>0){
      console.log("hello");
      let apps = this.redoStackedApps[this.redoStackedApps.length - 1];
      this.redoStackedApps.pop();
      this.stackedApps.push(apps);
      this.appList = JSON.parse(JSON.stringify(this.stackedApps[this.stackedApps.length - 1]));
    }
    
  }

  clearAll(event){
    this.restService.getDeviceApps(this.device_data.device_id).subscribe((response) => {
      this.appList = response;
      // this.stackedApps.push(response);
      console.log("stack length: " + this.stackedApps.length);

      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
  }
  resetPassword(event){
    var className = event.target.attributes.class.nodeValue.split(' ');
    className=className[className.length -1];
    console.log(className);
    if (className == "confirm_encrypted"){

    } else if (className == "confirm_guest"){

    } else if (className == "confirm_admin"){

    }
    
  }
  getAppIndex(apps, value) {
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].uniqueName === value) {
        return i;
      }
    }
  }

  searchApps(apps, key, value) {
    for (var i = 0; i < apps.length; i++) {
      if (apps[i][key] === value) {
        return apps[i];
      }
    }
  }

  onLogout() {
    // this.sockets.disconnect();
    this.restService.authSignOut();
  }

  ngOnDestroy(){
    // this.sockets.disconnect();
  }
}
