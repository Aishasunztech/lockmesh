import { Component, OnInit, Inject, ViewChild, ElementRef  } from '@angular/core';
import { RestService } from '../../rest.service';
import { PushNotificationService } from '../../push-notification.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router, ActivatedRoute} from '@angular/router';
import { Common } from '../../entity/common';

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
  };
  appList = [];
  demoApps=[];
  connected=false;
  baseUrl = this.common.baseurl;

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
    private spinnerService: Ng4LoadingSpinnerService,
    private pushNotification: PushNotificationService,
    private common: Common
  ) {
    
  }

  ngOnInit() {
    if(this.connected){
      console.log("this.connected: " + this.connected);
    }
  }
  
  //  async initIoConnection(device_id) {
  //    console.log("initIoConnection: " + device_id);
  //   await this.pushNotification.connect(device_id);

  //   this.pushNotification.onRequestApps();
    
  //   this.pushNotification.onGetApps().subscribe((resp) => {
  //     console.log("get Applications response");
  //     this.appList = JSON.parse(resp.data);
  //   });
    
  //   this.pushNotification.onEvent(Event.CONNECT)
  //     .subscribe(() => {
  //       this.connected=true;
  //       console.log('connected');
  //   });

  //   this.pushNotification.onEvent(Event.DISCONNECT)
  //     .subscribe(() => {
  //       this.connected = false;

  //       console.log('disconnected');
  //       this.pushNotification.reconnect();
  //   });
  // }
  
  ngAfterViewInit() {
    this.path = this.router.url.split('/');
    var device_id = this.path[2];

    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
    
    this.restService.getDeviceApps(device_id).subscribe((response) => {
      this.appList = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
  }
  
  // refresh button
  referesh(device_id) {
    
    device_id = this.route.snapshot.paramMap.get('device_id');
    
    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
    this.restService.getDeviceApps(device_id).subscribe((response) => {
      this.appList = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
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
    console.log(name);
    var value = event.target.value;
    console.log(value);
    var checked = event.target.checked;
    console.log(checked);
    var className = event.target.attributes.class.nodeValue;
    console.log(className);
    
    if(name == "check_all"){
      if(checked==true){
        if(value == "enable_all"){
          $('.enabled').prop('checked',true);
        }else if(value == "on_encrypted"){
          $('.encrypted').prop('checked', true);
        }else if(value == "on_guest"){
          $('.guest').prop('checked', true);
        }
      }else{
        if (value == "enable_all") {
          $('.enabled').prop('checked', false);
        } else if (value == "on_encrypted") {
          $('.encrypted').prop('checked', false);
        } else if (value == "on_guest") {
          $('.guest').prop('checked', false);
        }
      }
    }else{
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
        this.demoApps = this.getChangedApps(this.appList, 'isChanged', 1);

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

  applySettings(event){
    console.log(this.demoApps);
    
    console.log("applySettings");
  }
  
  undoSettings(event){
    console.log(this.demoApps);
    this.demoApps.pop();
    console.log(this.demoApps);
  }

  redoSettings(event){
    console.log()
  }

  clearAll(event){

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

  getChangedApps(apps, key, value) {

    let changedApps=[];
    let j=0;
    for (var i = 0; i < apps.length; i++) {
      if (apps[i][key] === value) {
        changedApps[j]=apps[i];
        delete changedApps[i].icon;
        j=j+1;
      }
    }
    return changedApps;
  }
  onLogout() {
    // this.pushNotification.disconnect();
    this.restService.authSignOut();
  }

  ngOnDestroy(){
    // this.pushNotification.disconnect();
    // this.connected=false;
  }
}
