import { Component, OnInit, Inject, ViewChild, ElementRef  } from '@angular/core';
import { RestService } from '../../rest.service';
import { PushNotificationService } from '../../push-notification.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router, ActivatedRoute} from '@angular/router';
import * as io from 'socket.io-client';
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

  socket: SocketIOClient.Socket;
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
    
  }
  
  ngAfterViewInit() {
    this.path = this.router.url.split('/');
    var device_id = this.path[2];
    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
    this.pushNotification.onGetApps(device_id).subscribe((resp) => {
      this.appList = JSON.parse(resp.data);
    });
  }
  onLogout() {
    this.restService.authSignOut();
  }
  // refresh button
  referesh(device_id) {
    device_id = this.route.snapshot.paramMap.get('device_id');
    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
    this.pushNotification.onGetApps(this.device_data.device_id).subscribe((resp) => {
      this.appList = JSON.parse(resp.data);
    });
  }
  unlinkUser(device_id) {
    Swal({
      text: 'Are you sure to unlink the device?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((result) =>  {
      this.spinnerService.show();
      if (result) {
        this.restService.unlinkUser(device_id);
        this.spinnerService.hide();
        this.router.navigate(['/devices']);
      }
    });
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
    console.log(event);

    var name = event.target.name;
    var value = event.target.value;
    var checked = event.target.checked;
    // var id = event.target.id;
    var className = event.target.class;

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

    }
  }
}
