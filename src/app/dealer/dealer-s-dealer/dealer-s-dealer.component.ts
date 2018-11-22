import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../../rest.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dealer-s-dealer',
  templateUrl: './dealer-s-dealer.component.html',
  styleUrls: ['./dealer-s-dealer.component.css']
})
export class DealerSDealerComponent implements OnInit {
  private resp: any = null;
  // sorting
  key = 'name'; // set default
  reverse = false;
    // initializing p to one
    p = 1;
  allSDelears: any = [];
  allSubDelears: any = [];
  data: any = {};

  constructor(private restService: RestService,  private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService,
  private spinnerService: Ng4LoadingSpinnerService) { }
  @ViewChild('deviceData') projectForm: NgForm;

  async ngOnInit() {
    this.spinnerService.show();
    await  this.allSDelearsView();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
    this.subdealerlist();
    document.body.style.zoom = '100%';
    $('#tablescroll').css('height', ($( window ).height() - $('#navbar').height() - 65));
  }

  onLogout() {
    this.restService.authdealerSignOut();
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  async   allSDelearsView() {
    const id =  this.restService.sessionLogin('id');
    console.log(id);
    this.spinnerService.show();
    await  this.restService.getUserSDealers().subscribe((response) => {
      this.spinnerService.hide();
    this.allSDelears = response;
    console.log(this.allSDelears);
    this.restService.authtoken(response);
    });
  }

  subdealerlist() {
  const id =  this.restService.sessionLogin('id');
    console.log(id);
  this.restService.getUserSubDealers(id).subscribe((response) => {
    this.allSubDelears = response;
    console.log(this.allSubDelears);
  });
}

  showEditForm(dealer) {
    console.log(dealer);
   // this.data = dealer.data;
    this.data.dealerId =  dealer.sdealer_id;
    this.data.name = dealer.sdealer_name;
    this.data.email = dealer.sdealer_email;
    this.data.link_code = dealer.sdealer_link_code;
    this.data.connected_devices = dealer.sdealer_connected_devices[0].total;
    console.log(this.data);
    if (!this.data) {
      this.data.name = '';
      this.data.email = '';
      this.data.link_code = '';
      this.data.connected_devices = '';
      this.data.tokens = '';
    } else {
      if (this.data.name === null) {
        this.data.name = '';
      }
      if (this.data.email === null) {
        this.data.email = '';
      }
    }
  }
  updateSubDealer() {
    if (this.data.email === '' || this.data.name === '' ||  this.data.email === 'null' || this.data.name === 'null' ) {
      Swal({
       text: 'Please Fill Name And Email .... ',
       type: 'error',
        customClass: 'swal-height'
         }).then(okay => {
           return;
        });
    } else {
      console.log(this.data);
      this.spinnerService.show();
      this.restService.updateAdminDealerDetails(this.data).subscribe((response) => {
          this.restService.authtoken(response);
          this.resp = response;
          if (this.resp.status === true) {
            this.spinnerService.hide();
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
            this.spinnerService.hide();
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
 // form for password reset
passEditForm(dealer) {
  console.log(dealer);
  this.data.dealerId =  dealer.sdealer_id;
  console.log(this.data.dealerId);
  this.data.email = dealer.sdealer_email;
  // this.data.email = this.data.dealer_email;
  if (!this.data) {
    this.data.email = '';
  } else {
    if (this.data.email === null) {
      this.data.email = '';
    }
  }
}

updatePassSubDealer() {
  if (this.data.email === '' ||  this.data.email === 'null' ) {
    Swal({
      text: 'Please Fill Email .... ',
      type: 'error',
       customClass: 'swal-height'
        }).then(okay => {
          return;
       });
      } else {
        console.log(this.data);
        this.spinnerService.show();
        this.data.type = 'sdealer';
        console.log(this.data);
        this.restService.updatedealerPassDealerDetails(this.data).subscribe((response) => {
            this.restService.authtoken(response);
            this.resp = response;
            console.log(this.resp );
            if (this.resp.status === true) {
              this.spinnerService.hide();
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
              this.spinnerService.hide();
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

suspendForm(dealer_id) {
  Swal({
    text: 'Are you sure to suspend the S-dealer? ' ,
    showCancelButton: true,
    useRejections: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    type: 'warning'
  }).then((okay) =>  {
    if (okay) {
      // location.reload(true);
      console.log(dealer_id);
      this.spinnerService.show();
      this.restService.suspendsdealerForm(dealer_id).subscribe((response) => {
   //     this.spinnerService.hide();
        this.restService.authtoken(response);
        this.resp = response;
        console.log(response);
        if (this.resp.status === true) {
          this.spinnerService.hide();
          Swal({
          text: this.resp.msg,
          type: 'success',
            customClass: 'swal-height'
            }).then(result => {
            if (result.value) {
              location.reload(true);
              }
            });
        } else {
          if (this.resp.status === false) {
            this.spinnerService.hide();
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
    }
  });
}

activateForm(dealer_id) {
      // console.log(device_id);
      Swal({
        text: 'Are you sure to activate the S-dealer?',
        showCancelButton: true,
        useRejections: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        type: 'warning'
      }).then((okay) =>  {
        if (okay) {
          this.spinnerService.show();
          this.restService.activatedealerForm(dealer_id).subscribe((response) => {
            this.resp = response;
            if (this.resp.status === true) {
              this.spinnerService.hide();
              Swal({
              text: this.resp.msg,
              type: 'success',
                customClass: 'swal-height'
                }).then(result => {
                if (result.value) {
                  location.reload(true);
                  }
                });
            } else {
              if (this.resp.status === false) {
                this.spinnerService.hide();
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
        }
      });
    }

  // Unlink dealer-device
unlinkSdealerUser(dealer_id) {
  console.log(dealer_id);
  Swal({
    text: 'Are you sure to Delete the S-dealer?',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    type: 'warning'
  }).then((result) =>  {
    if (result.value) {
      this.spinnerService.show();
      this.restService.unlinkdealerUser(dealer_id);
      this.spinnerService.hide();
    }
  });
}

  // Undo dealer-device
undoUser(dealer_id) {
  console.log(dealer_id);
  Swal({
    text: 'Are you sure to undo the S-dealer?',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    type: 'warning'
  }).then((result) =>  {
    if (result.value) {
      this.spinnerService.show();
      this.restService.undoUser(dealer_id).subscribe((response) => {
        this.spinnerService.hide();
        //  console.log(response);
        this.resp = response;
        if (this.resp.status === true) {
          this.spinnerService.hide();
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
          if (this.resp.status === false) {
            this.spinnerService.hide();
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
        }
      });
    }
  });
}
}
