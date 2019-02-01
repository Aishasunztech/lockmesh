import { Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {ApkService} from '../../services/apk.service';
import { RestService } from '../../services';
import { NgForm } from '@angular/forms';
import {Common} from '../../entity/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import Swal from 'sweetalert2';
import { from } from 'rxjs';
@Component({
  selector: 'app-view-apk',
  templateUrl: './view-apk.component.html',
  styleUrls: ['./view-apk.component.css']
})
export class ViewApkComponent implements OnInit {
  private resp: any = null;
  status = false;
  data: any = {};
  logo: File;
  apk: File;
  apkList = [];
  logolist = [];
  basrUrl = this.common.baseurl;
  // sorting
  key = 'dealer_name'; // set default
  reverse = false;
   // initializing p to one
   p = 1;
  constructor(private apkService: ApkService, private restService: RestService,
              private spinner: Ng4LoadingSpinnerService,
              private common: Common) { }
              @ViewChild('deviceData') projectForm: NgForm;

  ngOnInit() {
    this.getApkList();
    document.body.style.zoom = '100%';
  }
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  logoFile(event) {
    console.log(event.target.files);
    this.logo = event.target.files[0];
  }
  //
  apkFile(event) {
    console.log(event.target.files);
    this.apk = event.target.files[0];
  }
  // Get apk list
  getApkList() {
    this.spinner.show();
    this.apkService.getApkListApk().subscribe((response) => {
      this.spinner.hide();
      this.apkList = response.list;
      console.log(this.apkList);
    });
  }

  onLogout() {
    this.restService.authSignOut();
  }
  getLogolist(logo) {
   // console.log('Testing');
    this.apkService.getLogolist(logo).subscribe((response) => {
      console.log(response);
      this.logolist = response;
      console.log( this.logolist);
    });
  }
  // on Change event for button
  onChange(event, apkId) {
    console.log(event + ':' + apkId);
    if (event === true) {
      this.data.status = 'On';
    } else {
      this.data.status = 'Off';
    }
    this.data.apk_id = apkId;
    this.apkService.toggleApk(this.data).subscribe((response) => {
        console.log(response);
    });
  }
  getEnabled(status) {
    if (status === 'On') {
      return true;
     } else {
       return false;

    }

  }

  showEditForm(dealer) {
    console.log(dealer);
    this.data.apk_name =  dealer.apk_name;
    this.data.logo = dealer.logo;
    this.data.apk = dealer.apk;
    this.data.apk_id = dealer.apk_id;
    console.log(this.data);
    if (!this.data) {
      this.data.apk_name = '';
      this.data.logo = '';
      this.data.apk = '';
      this.data.apk_id = '';
    } else {
      if (this.data.apk_name === null) {
        this.data.name = '';
      }
    }
  }

  // Update apk
    updateAdminDealer() {
      if (this.data.apk_name === '' ||  this.data.apk_name === 'null'  ) {
        Swal({
         text: 'Please Fill Name .... ',
         type: 'error',
          customClass: 'swal-height'
           }).then(okay => {
             return;
          });
      } else {
        console.log(this.data);
        this.spinner.show();
        this.restService.updateApkDetails(this.data.apk_name, this.logo, this.apk, this.data.apk_id).subscribe((response) => {
            this.restService.authtoken(response);
            this.resp = response;
            if (this.resp.status === true) {
              this.spinner.hide();
              Swal({
              text: this.resp.msg,
              type: 'success',
                customClass: 'swal-height'
                }).then(okay => {
                if (okay) {
                  location.reload(true);
                  }
                });
               } else {
              this.spinner.hide();
              Swal({
                text: this.resp.msg,
                type: 'warning',
                  customClass: 'swal-height'
                  }).then(okay => {
                  if (okay) {
                    location.reload(true);
                    }
                  });
            }
          });
          $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
        }
      }

   // Unlink dealer-device
   unlinkdealerUser(apk_id) {
    console.log(apk_id);
    Swal({
      text: 'Are you sure to delete the Apk ?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then(async (result) =>  {
      if (result.value) {
      this.spinner.show();
      await this.restService.unlinkapk(apk_id);
      this.spinner.hide();
      }
    });
  }
}
