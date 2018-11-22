import { Component, OnInit, Inject, ViewChild, ElementRef  } from '@angular/core';
import { RestService } from '../../rest.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-connect-devices',
  templateUrl: './connect-devices.component.html',
  styleUrls: ['./connect-devices.component.css']
})
export class ConnectAdminDevicesComponent implements OnInit {
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

  constructor(private restService: RestService, private route: ActivatedRoute,
    private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
  private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    document.body.style.zoom = '100%';
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
}
