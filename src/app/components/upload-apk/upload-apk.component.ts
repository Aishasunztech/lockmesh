import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApkService} from '../../services/apk.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RestService } from '../../rest.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
@Component({
  selector: 'app-upload-apk',
  templateUrl: './upload-apk.component.html',
  styleUrls: ['./upload-apk.component.css']
})
export class UploadApkComponent implements OnInit {
  name;
  logoF: File;
  apkF: File;
  resp;
   // sorting
   key = 'name'; // set default
   reverse = false;
    // initializing p to one
    p = 1;
  constructor(private apkService: ApkService, private restService: RestService, private spinner: Ng4LoadingSpinnerService) { }
  @ViewChild('deviceData') projectForm: NgForm;

  ngOnInit() {
    document.body.style.zoom = '100%';
  }
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  logoFile(event) {
    console.log(event.target.files);
    this.logoF = event.target.files[0];
  }
  //
  apkFile(event) {
    console.log(event.target.files);
    this.apkF = event.target.files[0];
  }
  onLogout() {
    this.restService.authSignOut();
  }

  // Add apk with form
  addApk(data) {
    this.name = data.name;
    this.spinner.show();
    this.apkService.uploadApk(this.name, this.logoF, this.apkF).subscribe((response) => {
        console.log(response);
        this.resp = response;
        this.spinner.hide();
        if (this.resp.status === true) {
          Swal({
          text: this.resp.msg,
          type: 'success',
            customClass: 'swal-height'
            }).then(res => {
              if (res.value) {
                location.reload(false);
                }
              });
        } else {
            Swal({
            text: this.resp.msg,
            type: 'warning',
              customClass: 'swal-height'
              }).then(res => {
              if (res.value) {
                location.reload(false);
                }
              });
        }
    });
    $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
  }
}
