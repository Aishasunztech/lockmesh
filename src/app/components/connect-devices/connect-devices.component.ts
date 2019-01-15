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
import { forEach } from '@angular/router/src/utils/collection';

// import { Reference } from '@angular/compiler/src/render3/r3_ast';
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
    is_sync:0
  };
  isAdmin = false;
  userType:string;
  pageName:any= "main_menu";
  conf_admin_pwd:string;
  conf_guest_pwd:string;
  conf_enc_pwd:string;
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
  
  profile_type = "profile";

  profiles = [];
  policies = [];
  mainProfiles = [];
  deviceHistories = [];

  dealer_id:number;

  profileName:string;
  policyName:string;

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
    private spinnerService: Ng4LoadingSpinnerService,
    private common: Common
    // private sockets:PushNotificationService
  ) {
    this.dealer_id=Number(window.localStorage.getItem("id"));
    if (window.localStorage.getItem("type").replace(/"/g, "") == "admin") this.isAdmin = true;
    this.userType = window.localStorage.getItem("type").replace(/"/g,"");
    // if (this.isAdmin) this.profile_type = "policy";
  }

  ngOnInit() {
    this.path = this.router.url.split('/');
    let device_id = this.path[2];
    
    this.spinnerService.show();

    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.restService.authtoken(response);
    });

    this.restService.getDeviceApps(device_id).subscribe((response) => {
      this.appList = response;
      this.stackedApps.push(this.copyObject(response));
      this.restService.authtoken(response);
    });

    this.getProfiles();
    this.getHistories(device_id);

    let token = window.localStorage.getItem('token');
    
    $('.on_guest').prop('checked', this.checkedAll('guest'));
    $('.on_encrypted').prop('checked', this.checkedAll('encrypted'));
    $('.enable_all').prop('checked', this.checkedAll('encrypted'));
    
    let makeToken = "token=" + token + "&device_id=" + device_id + "&isWeb=true";
    console.log("token query: " + makeToken);

    // this.sockets = io.connect(this.baseUrl.toString(), {
    //   query: makeToken,
    //   reconnectionDelay: 1000,
    //   reconnection: true,
    //   forceNew: true
    // });
    // console.log("get_sync_status_"+ device_id);
    // this.sockets.on('get_sync_status_' + device_id, (data) => {
    //   this.spinnerService.show();
    //   this.refresh(device_id);
    //   this.spinnerService.hide();
    // });
    
  }

  getProfiles(){
    this.profiles=[];
    this.policies=[];

    if (this.isAdmin) {
      // all policies, all profiles
      this.restService.getProfiles().subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == "profile") {
            this.profiles.push(elem);
          } else if (elem.type = "policy") {
            this.policies.push(elem);
          }
        });
        this.mainProfiles = response.profiles;

        this.restService.authtoken(response);
      });
    } else if (this.userType == "dealer") {
      // all policies, his profiles
      this.restService.getProfiles(this.dealer_id).subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == "profile") {
            this.profiles.push(elem);
          } else if (elem.type = "policy") {
            this.policies.push(elem);
          }
        });
        this.mainProfiles = response.profiles;

        this.restService.authtoken(response);
      });
    } else if (this.userType == "sdealer") {
      // all policies, his dealer profiles

    }
  }

  getHistories(device_id){
    console.log("histories");
    console.log(device_id);
    this.restService.getProfiles(null,null,device_id).subscribe((response) => {
      console.log(response.profiles);
      this.deviceHistories = response.profiles;

      this.restService.authtoken(response);
    });
    
  }
  ngAfterViewInit() {
    console.log("ngAfterViewInit");

  }
  
  // refresh button
  refresh(device_id) {
    console.log("refresh click");
    device_id = this.route.snapshot.paramMap.get('device_id');
    this.spinnerService.show();

    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;  
      this.restService.authtoken(response);
    });
    console.log(this.device_data);

    this.emptyStack();
    
    this.restService.getDeviceApps(device_id).subscribe((response) => {
      this.appList = response;
    
      this.stackedApps.push(this.copyObject(response));
      this.restService.authtoken(response);
    });
    this.getProfiles();
    this.getHistories(device_id);


    $('.on_guest').prop('checked', this.checkedAll('guest'));
    $('.on_encrypted').prop('checked', this.checkedAll('encrypted'));
    $('.enable_all').prop('checked', this.checkedAll('encrypted'));

    this.conf_admin_pwd = null;
    this.conf_guest_pwd = null;
    this.conf_enc_pwd = null;
    this.passwords.admin_password = null;
    this.passwords.guest_password = null;
    this.passwords.encrypted_password = null;
    this.spinnerService.hide();
  }
  
  changePage(pageName,event){
     this.pageName=pageName;
    // this.conf_admin_pwd='';
    // this.conf_guest_pwd='';
    // this.conf_enc_pwd='';
    // this.passwords.admin_password='';
    // this.passwords.guest_password='';
    // this.passwords.encrypted_password='';
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
  saveProfile(event,profile_type){
    let profileName;
    if(profile_type=="policy"){
      profileName = this.policyName;
    }else{
      profileName = this.profileName;
    }

    if(profileName!=null && profileName != ''){
      if (this.stackedApps.length > 1 || this.passwords.admin_password || this.passwords.guest_password || this.passwords.encrypted_password) {
        // let app_list = this.getChangedApps(this.stackedApps[this.stackedApps.length - 1]);
        let app_list = this.stackedApps[this.stackedApps.length - 1];
        console.log("app_list");
        console.log(app_list);

        let device_setting = {
          app_list: app_list,
          passwords: this.passwords
        };
        
        this.restService.applySettings(device_setting, this.device_data.device_id, profile_type, profileName, this.dealer_id);
        this.clearStack();

        Swal({
          text: 'Settings are successfully saved as ' + this.profileName,
          showCancelButton: false,
          useRejections: false,
          // cancelButtonText: 'No',
          // confirmButtonText: 'Yes',
          type: 'success'
        }).then(() => {
        });
      } else {
        Swal({
          text: 'please make a change before save settings!',
          showCancelButton: false,
          useRejections: false,
          // cancelButtonText: 'No',
          // confirmButtonText: 'Yes',
          type: 'info'
        }).then(() => {
        });
      }
    }else{
      Swal({
        text: 'please insert a name',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'info'
      }).then(() => {
      });
    }
    
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
  
  loadProfile(event){
    let profileId = event.target.value;
    console.log(this.mainProfiles);

    this.mainProfiles.forEach(elem=>{
      if(elem.id == profileId){
        this.appList = JSON.parse(elem.app_list);
        this.stackedApps.push(this.copyObject(JSON.parse(elem.app_list)));  
      }
    });
  }

  loadHistory(event){
    let profileId = event.target.value;
    console.log(this.mainProfiles);

    this.deviceHistories.forEach(elem => {
      if (elem.id == profileId) {
        this.appList = JSON.parse(elem.app_list);
        this.stackedApps.push(this.copyObject(JSON.parse(elem.app_list)));
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
          $('.on_guest').prop('checked', this.checkedAll('guest'));
        }

        if (className == "encrypted" && checked == false) {
          $('.on_encrypted').prop('checked', false);
          this.appList[appIndex].encrypted=0;
        }else if(className == "encrypted" && checked == true){
          this.appList[appIndex].encrypted=1;
          $('.on_encrypted').prop('checked', this.checkedAll('encrypted'));
        }

        if (className == "enabled" && checked == false) {
          $('.enable_all').prop('checked', false);
          this.appList[appIndex].enable=0;
        }else if(className == "enabled" && checked == true){
          this.appList[appIndex].enable=1;
          $('.enable_all').prop('checked', this.checkedAll('encrypted'));

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
  checkedAll(key){
    var i = 0;
    this.appList.forEach((elem) => {
      if (elem[key] == 1) {
        i = i + 1;
      }
    });
    if(this.appList.length==i){
      return true;
    }else{
      return false;
    }
  }
  setSelectAll(key,value){
    this.appList.forEach((elem)=>{
      elem[key]=value
    });
  }

  applySettings(event){
    console.log("apply settings");
    console.log(this.passwords);
    console.log("stack apps");
    console.log(this.stackedApps);
    if (this.stackedApps.length > 1 || this.passwords.admin_password || this.passwords.guest_password || this.passwords.encrypted_password ){
      // let app_list = this.getChangedApps(this.stackedApps[this.stackedApps.length -1]);
      let app_list = this.stackedApps[this.stackedApps.length-1];
      console.log("app_list");
      console.log(app_list);

      let device_setting ={
        app_list: app_list,
        passwords: this.passwords
      };
      console.log(device_setting);
      this.restService.applySettings(device_setting,this.device_data.device_id);
      this.clearStack();

      Swal({
        text: 'Settings are successfully applied',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'success'
      }).then(()=>{
      });
    }else{
      Swal({
        text: 'please make a change before apply!',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'info'
      }).then(() => {
      });
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
    
    }else{
      Swal({
        text: 'there is no setting to undo',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'info'
      }).then(() => {
      });
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
    }else{
      Swal({
        text: 'there is no setting to redo',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'info'
      }).then(() => {
      });
    }
    
  }

  clearAll(event){
      Swal({
        text: 'settings are cleared successfully',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'success'
      }).then(() => {
      });
      this.refresh(this.device_data.device_id);
  }
  resetPassword(event,value){
    var className = event.target.attributes.class.nodeValue.split(' ');
    className=className[className.length -1];
    
    if (className == "confirm_encrypted"){
      if(this.passwords.encrypted_password==value){
        this.toggleClass('.pwd_confirmed');
      }else{
        this.toggleClass('.not_matched');        
      }
    } else if (className == "confirm_guest"){
      if (this.passwords.guest_password == value) {
        this.toggleClass('.pwd_confirmed');
      } else {
        this.toggleClass('.not_matched');
      }
    } else if (className == "confirm_admin"){
      if (this.passwords.admin_password == value) {
        this.toggleClass('.pwd_confirmed');
      } else {
        this.toggleClass('.not_matched');
      }
    }
    
  }
  toggleClass(className){
    console.log(className);
    $(className).fadeIn('slow', function () {
      $(className).delay(1000).fadeOut();
    });
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
