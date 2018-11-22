import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../../rest.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dealer-create-sdealer',
  templateUrl: './dealer-create-sdealer.component.html',
  styleUrls: ['./dealer-create-sdealer.component.css']
})
export class DealerCreateSdealerComponent implements OnInit {
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
    this.restService.authdealerSignOut();
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
   this.spinnerService.show();
   await  this.restService.addSDealerbydealer(this.sDealer).subscribe((resp) => {
    this.spinnerService.hide();
    console.log(resp);
      this.resp = resp;
      if (this.resp.status === true) {
        Swal({
        text: 'You have successfully add S-dealers',
        type: 'success',
          customClass: 'swal-height'
          }).then(okay => {
          if (okay) {
            this.router.navigate(['/dealer/s-dealer']);
            }
        });
      } else {
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
