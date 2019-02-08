import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../../services/rest.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router} from '@angular/router';
import * as enLocale from 'date-fns/locale/en';
import * as $ from 'jquery';
import { throwError } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent implements OnInit {
  @ViewChild('deviceData') projectForm: NgForm;
  private resp: any = null;
  // sorting
  key = 'dealer_name'; // set default
  reverse = false;
  // initializing p to one
  p = 1;
  perPage=10;

  dealer: any = {};
  allDelears: any = [];
  allDemoDealers=[];
  data: any = {
    dealer_name: '',
    dealer_id: '',
    dealer_email: '',
    dealer_pin: '',
    connected_devices: '',
    tokens: '',
  };

  constructor(
    private restService: RestService, 
    private router: Router, 
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
   private spinnerService: Ng4LoadingSpinnerService)  {

   }
  

  async  ngOnInit() {
    await  this.spinnerService.show();
    setTimeout(() => {
      this.allDelearsView();
    }, 1000);
    $('#tablescroll').css('height', ($( window ).height() - $('#navbar').height() - 65));
  }

  addDelear(delear) {
    this.restService.addDealer(delear);
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
    console.log(this.key + ':' + this.reverse);
  }


  async allDelearsView() {
   await this.restService.getUserDealers().subscribe((response) => {
      this.allDelears = response;
      this.allDemoDealers = response;
      this.spinnerService.hide();
      this.restService.authtoken(response);
    });
  }

  showEditForm(dealer) {
    console.log(dealer);
    this.data = dealer;
    this.data.dealerId =  dealer.dealer_id;
    this.data.name = dealer.dealer_name;
    this.data.email = dealer.dealer_email;
    this.data.connected_devices = this.data.connected_devices[0].total;
    console.log(this.data);
    this.data.name = this.data.dealer_name;
    this.data.email = this.data.dealer_email;
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

  dealerFilter(elem){
    const list1 = this.allDemoDealers;
    this.allDelears = [];
    //var name = elem.target.name;
    var value = elem.target.value;
    
    if(value == "Suspended"){
      list1.forEach(ele => {
        if (ele.account_status!= null && ele.account_status.toString().toUpperCase().includes(value.toUpperCase())) {
          this.allDelears.push(ele);
        }
      });
    }else if(value == "Unliked/Deleted"){
      list1.forEach(ele => {
        if (ele.unlink_status == 1) {
          this.allDelears.push(ele);
        }
      });
    }else if(value =="Active"){
      list1.forEach(ele => {
        if (ele.unlink_status !=1 && ele.account_status!='suspended') {
          this.allDelears.push(ele);
        }
      });
    }else{
      list1.forEach(ele => {
          this.allDelears.push(ele);
      });
    }
  }
  // form for password reset
  passEditForm(dealer) {
    console.log(dealer);
    this.data = dealer;
    this.data.dealerId =  dealer.dealer_id;
    this.data.email = dealer.dealer_email;
    this.data.email = this.data.dealer_email;
    if (!this.data) {
      this.data.email = '';
    } else {
      if (this.data.email === null) {
        this.data.email = '';
      }
    }
  }

  updatePassDealer() {
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
      this.data.type = 'dealer';
      console.log(this.data);
      this.restService.updateAdminPassDealerDetails( this.data).subscribe((response) => {
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
          //  this.spinnerService.hide();
        }
      });
      $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
    }
  }

  updateAdminDealer() {
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

  // suspend dealer-device
  suspendForm(dealer_id) {
    Swal({
      text: 'Are you sure to suspend the device? Suspending Dealers also suspend all the S-Dealer..?',
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
          //   this.spinnerService.hide();
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

  // activate dealer-device
  activatedealerForm(dealer_id) {
    Swal({
      text: 'Are you sure to activate the device? Activating Dealer will also activate sub dealers..?',
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
  unlinkdealerUser(dealer_id) {
    console.log(dealer_id);
    Swal({
      text: 'Are you sure to delete the dealer ? Deleting dealer will also delete sub dealers..?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then(async (result) =>  {
      if (result.value) {
        this.spinnerService.show();
        await this.restService.unlinkdealerUser(dealer_id);
        this.spinnerService.hide();
      }
    });
  }

  // Undo dealer-device
  undoUser(dealer_id) {
    console.log(dealer_id);
    Swal({
      text: 'Are you sure to undo the dealer?Undo the dealer will undo the sub dealers also?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((result) =>  {
      if (result.value) {
        this.spinnerService.show();
        this.restService.undoUser(dealer_id).subscribe((response) => {
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
  paging(elem){
    console.log(elem);
    var value = elem.target.value;
    // console.log(value);
    this.perPage=value;
    console.log(this.perPage);

  }
  searchDealer(value){
     var list = this.allDemoDealers;
     this.allDelears = [];
     value = value.toLowerCase();
     this.allDelears = list.filter(function (o) {
       return ['status','dealer_id','dealer_name','dealer_email','link_code'].some(function (k) {
            if(o[k]!=null){
              return o[k].toString().toLowerCase().indexOf(value) !== -1;

            }else{
              return o[k];
            }
        });
     });
  }
  // delete
  deleteUserDetails(dealer_id) {
       Swal({
          text: 'Are you sure to delete the S Dealer?',
          showCancelButton: true,
          cancelButtonText: 'No',
          confirmButtonText: 'Yes',
          type: 'warning'
        }).then((result) =>  {
        if (result.value) {
          this.spinnerService.show();
          this.restService.deleteUser(dealer_id);
          this.spinnerService.hide();
        }
      });
  }

  onLogout() {
    this.restService.authSignOut();
  }
}
