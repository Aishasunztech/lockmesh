import { Component, OnInit, Inject, ViewChild, ElementRef  } from '@angular/core';
import { RestService } from '../../rest.service';
import { PushNotificationService } from '../../push-notification.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router, ActivatedRoute} from '@angular/router';
import { Event } from '../../entity/event';
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';

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
  connected=false;

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
    private spinnerService: Ng4LoadingSpinnerService,
    private pushNotification: PushNotificationService
  ) {
    
  }

  ngOnInit() {
    if(this.connected){
      console.log("this.connected: " + this.connected);

      this.pushNotification.onGetApps().subscribe((resp) => {
        this.appList = JSON.parse(resp.data);
      });
    }
  }
  
   async initIoConnection(device_id) {
     console.log("initIoConnection: " + device_id);
    await this.pushNotification.connect(device_id);

    this.pushNotification.onRequestApps();
    
    this.pushNotification.onGetApps().subscribe((resp) => {
      console.log("get Applications response");
      this.appList = JSON.parse(resp.data);
    });
    
    this.pushNotification.onEvent(Event.CONNECT)
      .subscribe(() => {
        this.connected=true;
        console.log('connected');
    });

    this.pushNotification.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        this.connected = false;

        console.log('disconnected');
        this.pushNotification.reconnect();
    });
  }
  
  ngAfterViewInit() {
    this.path = this.router.url.split('/');
    var device_id = this.path[2];

    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
    
    // this.restService.getDeviceApps(device_id).subscribe((response) => {
    //   this.appList = response;
    //   this.spinnerService.hide();
    //   this.restService.authtoken(response);
    // });

    this.initIoConnection(device_id);    
    
    
  }
  
  // refresh button
  referesh(device_id) {
    console.log(this.connected);
    
    device_id = this.route.snapshot.paramMap.get('device_id');
    
    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
    // this.restService.getDeviceApps(device_id).subscribe((response) => {
    //   this.appList = response;
    //   this.spinnerService.hide();
    //   this.restService.authtoken(response);
    // });

    this.pushNotification.onRequestApps();

    
  }
  
  imageToBase64(byte){
    var binary = '';
    var bytes = new Uint8Array(byte);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return "data:image/JPEG;base64," + window.btoa(binary);
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

  checkApps(event){

    var name = event.target.name;
    var value = event.target.value;
    var checked = event.target.checked;
    // var id = event.target.id;
    var className = event.target.attributes.class.nodeValue;
    
    console.log(name);
    console.log(value);
    console.log(checked);
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
      if (className =="guest" && checked==false){
        $('.on_guest').prop('checked', false);
      }

      if(className == "encrypted" && checked==false){
        $('.on_encrypted').prop('checked', false);
      }

      if(className == "enabled" && checked==false){
        $('.enable_all').prop('checked', false);

      }
    }
  }

  onLogout() {
    this.pushNotification.disconnect();
    this.restService.authSignOut();
  }

  ngOnDestroy(){
    this.pushNotification.disconnect();
    this.connected=false;
  }
}
