import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { RestService } from '../../rest.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @ViewChild('inputBox') _el: ElementRef;
  data: any = {
    demail: '',
    pwd: '',
    type: ''
  };
  resp: any = {
    data: {
      email: '',
      id: '',
      type: ''
    }
  };

  constructor(private restService: RestService, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService,
   private spinnerService: Ng4LoadingSpinnerService) { }
  @ViewChild('deviceData') projectForm: NgForm;

  ngOnInit() {
  }

  adminLogin() {
    this.spinnerService.show();
    this.data.type = 'admin';
      this.restService.adminLogin(this.data).subscribe(resp => {
        this.spinnerService.hide();
        this.resp = resp;
        if (this.resp.status === true) {
          this.storage.set('email', this.resp.user.email);
          this.storage.set('id', this.resp.user.id);
          this.storage.set('token', this.resp.token);
          this.storage.set('name', this.resp.user.dealer_name);
          this.storage.set('firstName', this.resp.user.firstName);
          this.storage.set('lastName', this.resp.user.lastName);
          this.storage.set('connected_dealer',this.resp.user.connected_dealer);
          this.storage.set('type', this.resp.user.user_type);
          this.router.navigate(['/devices']);
        } else {
            Swal ({
              text: this.resp.msg,
              type: 'warning',
                }).then(okay => {
                if (okay) {
                  // location.reload(true);
                  }
              });
        }
    });
    $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
  }

  // login() {
  //   if (this.data.type === 'Admin') {
  //     this.adminLogin();
  //   }
    // else if (this.data.type === 'Dealer') {
    //   this.dealerLogin();
    // }
  // }
}
