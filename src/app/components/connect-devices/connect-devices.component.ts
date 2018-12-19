import { Component, OnInit, Inject, ViewChild, ElementRef  } from '@angular/core';
import { RestService } from '../../rest.service';
import { PushNotificationService } from '../../push-notification.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router, ActivatedRoute} from '@angular/router';
import * as io from 'socket.io-client';

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
    this.pushNotification.onNewMessage().subscribe(function(resp){
      console.log(resp);
    });

  }
  onBtClick(){
    this.pushNotification.sendMessage();
  }
  ngAfterViewInit() {
    this.path = this.router.url.split('/');
    var device_id = this.path[2];
    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
  }
  onLogout() {
    this.restService.authSignOut();
  }
  // refresh button
  referesh(device_id) {
    device_id = this.route.snapshot.paramMap.get('device_id');
    this.restService.refreshlist(device_id).subscribe((response) => {
      console.log(response);
      this.device_data = response;
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
    }).then((result) =>  {
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
    console.log(event);
    
    var name = event.target.name;
    var value = event.target.value;
    var checked = event.target.checked;
    var id = event.target.id;
    var className = event.target.class;

    console.log(className);
    console.log(checked);
    console.log(value);
    console.log(name);
    console.log(id);

    if(name == "check_all"){
      if(checked==true){
        if(value == "enable_all"){
          console.log(value);
        }else if(value == "on_encrypted"){
          console.log(value);
        }else if(value == "on_guest"){
          console.log(value);
        }
      }else{

      }
    }else{

    }
  }
}
