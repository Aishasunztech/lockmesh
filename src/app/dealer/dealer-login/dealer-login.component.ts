import { Component, OnInit,  ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { RestService } from '../../rest.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dealer-login',
  templateUrl: './dealer-login.component.html',
  styleUrls: ['./dealer-login.component.css']
})
export class DealerLoginComponent implements OnInit {
  @ViewChild('inputBox') _el: ElementRef;
  data: any = {
    demail: '',
    pwd: ''
  };
  resp: any = {
    data: {
      email: '',
      id: ''
    }
  };

  constructor(private restService: RestService, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService,
  private spinnerService: Ng4LoadingSpinnerService) { }
  @ViewChild('deviceData') projectForm: NgForm;

  ngOnInit() {
    document.body.style.zoom = '100%';
  }

  dealerLogin() {
    this.data.type = 'dealer';
    console.log(this.data);
    this.spinnerService.show();
    this.restService.dealerLogin(this.data).subscribe(resp => {
      this.spinnerService.hide();
      this.resp = resp;
      console.log(resp);
      if (this.resp.status === true) {
        this.storage.set('email', this.resp.user.dealer_email);
        this.storage.set('id', this.resp.user.dealer_id);
        this.storage.set('token', this.resp.token);
        this.storage.set('name', this.resp.user.dealer_name);
        this.storage.set('type', 'dealer');
        this.router.navigate(['/dealer/devices']);
      } else  {
        Swal ({
          text: this.resp.msg,
          type: 'warning',
            customClass: 'swal-height'
            }).then(okay => {
            if (okay) {
              // location.reload(true);
              }
          });
      }
    });
    $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
  }
}
