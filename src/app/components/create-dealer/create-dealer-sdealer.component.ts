import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-create-dealer-sdealer',
  templateUrl: './create-dealer-sdealer.component.html',
  styleUrls: ['./create-dealer-sdealer.component.css']
})
export class CreateDealerSdealerComponent implements OnInit {
  private resp: any = '';
  @ViewChild('inputBox') _el: ElementRef;
  constructor(private restService: RestService, private router: Router, private spinnerService: Ng4LoadingSpinnerService) { }
  @ViewChild('deviceData') projectForm: NgForm;

  ngOnInit() {
    document.body.style.zoom = '100%';
  }


  onLogout() {
    this.restService.authSignOut();
  }

  async addDealer(dealer) {
    dealer.type = 'dealer';
    await  this.spinnerService.show();
    this.restService.addDealer(dealer).subscribe((response) => {
      this.restService.authtoken(response);
      console.log(this.resp);
        this.resp = response;
        if (this.resp.status === true) {
          this.spinnerService.hide();
          Swal({
          text: 'You have successfully add dealers',
          type: 'success',
            customClass: 'swal-height'
            }).then(okay => {
            if (okay) {
              this.router.navigate(['/dealer']);
              }
          });
        } else {
          this.spinnerService.hide();
          Swal({
            text: 'Dealer Already registered please use another email',
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

