import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../../rest.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-create-sdealer',
  templateUrl: './create-sdealer.component.html',
  styleUrls: ['./create-sdealer.component.css']
})
export class CreateSdealerComponent implements OnInit {
  @ViewChild('inputBox') _el: ElementRef;
  private resp: any = null;
  allDelears: any = [];
  sDealer: any = {};
  constructor(private restService: RestService, private router: Router, private spinnerService: Ng4LoadingSpinnerService) { }
  @ViewChild('deviceData') projectForm: NgForm;

   ngOnInit() {
   this.getDealerNames();
   document.body.style.zoom = '100%';
  }

  onLogout() {
    this.restService.authSignOut();
  }

  // for select a dealer name
  getDealerNames() {
    this.restService.getUserDealers().subscribe((resp) => {
      console.log(resp);
        this.allDelears = resp;
    });
  }

  async addSDealer() {
    this.sDealer.type = 'sdealer';
    console.log(this.sDealer);
   await  this.spinnerService.show();
    this.restService.addSDealer(this.sDealer).subscribe((resp) => {
      console.log(resp);
      // const resp = JSON.parse(response['body']);
        // console.log(resp);
        this.resp = resp;
        if (this.resp.status === true) {
          this.spinnerService.hide();
          Swal({
          text: 'You have successfully add S-dealers',
          type: 'success',
            customClass: 'swal-height'
            }).then(okay => {
            if (okay) {
              this.router.navigate(['/sdealer']);
              }
          });
        } else {
          this.spinnerService.hide();
          Swal({
            text: resp.msg,
            type: 'error',
              customClass: 'swal-height'
              }).then(okay => {
              if (okay) {
                }
            });

        }
    });
    $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
  }
}

