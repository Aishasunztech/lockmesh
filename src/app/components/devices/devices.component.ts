import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../../rest.service';
import { GlobalSearchService } from '../../global-search.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router} from '@angular/router';
import * as enLocale from 'date-fns/locale/en';
import * as $ from 'jquery';

import { DatepickerOptions } from 'ng2-datepicker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { element } from '@angular/core/src/render3/instructions';

const today = new Date();
// tslint:disable-next-line:max-line-length
const timest = (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes());
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timest;
@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-devices], [ngbd-dropdown-basic]' ,
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {
  name = 'Angular';
  private resp: any = null;
  i = 0;
  perPage = 10;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = [];
  public allDevice: any = [];
  allDeviceDummyList = [];
  isAdmin=false;
  userType:any;
  searchFilterValue: any;
  // sorting
  key = 'status'; // set default
  reverse = true;
  // initializing p to one
  componentName = null;
  p = 1;
  state: any = {
    name: false,
    email: false,
    client_id: false,
    // dealer_id: false,
    model: false,
    imei: false,
    simno: false,
    online: false,
    serial_number: false,
    dealer_name: false,
    mac_address: false,
    link_code: false,
    device_id: false,
    start_date: false,
    expiry_date: false,
    status: false,
    // s_dealer: false,
    // s_dealer_name: false
  };

  data: any = {
    name: '',
    email: '',
    client_id: '',
    dealer_id: '',
    model: '',
    link_code: '',
    imei: '',
    simno: '',
    status: '',
    online: '',
    serial_number: '',
    mac_address: '',
    device_id: ''
   };

  options: DatepickerOptions = {
    displayFormat: 'YYYY-MM-DD',
    barTitleFormat: 'YYYY MMMM',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    locale: enLocale,
    minDate: new Date(date), // Minimal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };

  constructor(
    private restService: RestService,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
   private spinnerService: Ng4LoadingSpinnerService
  ) {
  }

  @ViewChild('deviceData') projectForm: NgForm;

  async ngOnInit() {

    this.userType =window.localStorage.getItem('type').replace(/['"]+/g, '');

    this.dropdownList = [
     {'id': 1, 'itemName': 'name'},
     {'id': 2, 'itemName': 'email'},
     {'id': 3, 'itemName': 'Client_id'},
     {'id': 4, 'itemName': 'link_code'},
     {'id': 5, 'itemName': 'Status'},
     {'id': 6, 'itemName': 'device_id'},
     {'id': 7, 'itemName': 'Model'},
     {'id': 8, 'itemName': 'Start_date'},
     {'id': 9, 'itemName': 'Expiry_date'},
     {'id': 10, 'itemName': 'Dealer_Name'},
     {'id': 11, 'itemName': 'IMEI'},
     {'id': 12, 'itemName': 'Simno'},
     {'id': 13, 'itemName': 'online'},
     {'id': 14, 'itemName': 'serial_number'},
     {'id': 15, 'itemName': 'Mac_address'}
   ];

    if(this.userType=="admin"){
      this.dropdownList.push({'id': 17, 'itemName': 'dealer_id'});
      this.state.dealer_id= false;
    }

    if (this.userType=="dealer" || this.userType=="admin"){
      this.dropdownList.push(
        {'id': 16, 'itemName': 's_dealer_name'},
        {'id': 18, 'itemName': 's_dealer'}
      );
      this.dropdownList.s_dealer= false;
      this.dropdownList.s_dealer_name= false;
    }

    this.spinnerService.show();
    await this.allDeviceView();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);

    $('#tablescroll').css('height', ($( window ).height() - $('#navbar').height() - 65));

    this.selectedItems = [
    ];

    await this.getAdminSelectedItems();
    // this.isSelectedItems();
    this.dropdownSettings = {
      text: 'DISPLAY',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      classes: 'myclass custom-class',
      searchPlaceholderText: 'DISPLAY',
      showCheckbox: true
    };

    await this.aclHandler();
    setTimeout(() => {
      //this.spinnerService.hide();
    }, 1000);
    $('.c-btn span').remove();
    $('.c-btn').append("<span class='select_placeholder'>DISPLAY</span>");
    $('.c-btn').append("<span class='c-angle-up fa fa-caret-down'></span>");

  }

  async aclHandler(){
    // this.isComponentAllowed =
    const response1 = await this.restService.isAdmin().toPromise();
    this.isAdmin = response1.isAdmin;

  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }
  // get admin selected device items
  async getAdminSelectedItems() {
    const response = await this.restService.getAdminSelectedItems(Headers).toPromise();
    response.data = JSON.parse(response.data);
    const alength = response.data.length;
    for ( this.i = 0; this.i < alength; this.i++) {
      this.onItemSelect(response.data[this.i], 'initVal');
      this.selectedItems.push(response.data[this.i]);
    }
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }


  isSelectedItems(){
    var self=this;
    this.dropdownList.map(function(s) {
      self.selectedItems.map(function(i){
        if(s.itemName===i.itemName){
          s.isSelected=true;
        }
      });
    });

  }
  // getSelectedOptions(selected){
  //   console.log("i am here");
  // }

  onItemSelect(item: any, initVal) {

    if ( item.itemName === 'name') {
        this.state.name = true;
    } else if (item.itemName === 'link_code') {
      this.state.link_code = true;
    } else if (item.itemName === 'Client_id') {
      this.state.client_id = true;
    } else if (item.itemName === 'Model') {
      this.state.model = true;
    } else if (item.itemName === 'Dealer_Name') {
      this.state.dealer_name = true;
    } else if (item.itemName === 'IMEI') {
      this.state.imei = true;
    } else if (item.itemName === 'Simno') {
      this.state.simno = true;
    } else if (item.itemName === 'Status') {
      this.state.status = true;
    } else if (item.itemName === 'serial_number') {
      this.state.serial_number = true;
    } else if (item.itemName === 'Mac_address') {
      this.state.mac_address = true;
    } else if (item.itemName === 'device_id') {
      this.state.device_id = true;
    } else if (item.itemName === 'Start_date') {
      this.state.start_date = true;
    } else if (item.itemName === 'Expiry_date') {
      this.state.expiry_date = true;
    } else if (item.itemName === 'email') {
      this.state.email = true;
    } else if (item.itemName === 'online') {
      this.state.online = true;
    } else if (item.itemName === 's_dealer_name') {
      this.state.s_dealer_name = true;

    } else if (item.itemName === 'dealer_id') {
      this.state.dealer_id = true;
    } else if (item.itemName === 's_dealer') {
      this.state.s_dealer = true;
    }
    // update selected items for dealer
    if (initVal == null) {
      this.restService.postAdminSelectedItems(this.selectedItems);
    }
  }

  collapse(device,e){
    var clsName=e.target.attributes.class.nodeValue;
    var elem=$(e.target);
    var dropdown=this.dropdownList;
    var selected = this.selectedItems;

    if(clsName == "fa fa-plus"){
      elem.attr('class','fa fa-times');
      elem.parent().attr('class','unexpand rounded');

      var toShow = dropdown.filter( function( el ) {
        return selected.map(function(e) { return e.id; }).indexOf(el.id) < 0;
      });

      var showstring="<tr>";
      toShow.map(function(e){

        // if(device[e.itemName.toLowerCase()]){
          showstring = showstring + "<tr><th>" + e.itemName.toLowerCase() + ":</th>" + "<td>" + device[e.itemName.toLowerCase()] + "</td></tr>";
        // }
      });
      showstring = showstring + "</tr>";

      $(document).find('.detailed_row_'+device.device_id).children('td').html(showstring);
      $(document).find('.detailed_row_'+device.device_id).show();

    }else if(clsName == "expand rounded"){
      elem.attr('class','unexpand rounded');
      elem.children().attr('class', 'fa fa-times');

      var toShow = dropdown.filter( function( el ) {
        return selected.map(function(e) { return e.id; }).indexOf(el.id) < 0;
      });

      var showstring="<tr>";
      toShow.map(function(e){
        // if(device[e.itemName.toLowerCase()]){
          showstring = showstring + "<tr><th>" + e.itemName.toLowerCase() + ":</th>" + "<td>" + device[e.itemName.toLowerCase()] + "</td></tr>";
        // }
      });
      showstring = showstring + "</tr>";
      $(document).find('.detailed_row_'+ device.device_id).children('td').html(showstring);
      $(document).find('.detailed_row_'+ device.device_id).show();
    }else if(clsName == "unexpand rounded"){
      var tr=elem.parent('.btnFull').parent();
      $(document).find('.detailed_row_'+device.device_id).hide();

      elem.attr('class','expand rounded');
      elem.children().attr('class', 'fa fa-plus');
    }else if(clsName == "fa fa-times"){
      var tr=elem.parent('.btnFull').parent();
      $(document).find('.detailed_row_'+device.device_id).hide();
      elem.attr('class','fa fa-plus');
      elem.parent().attr('class','expand rounded');
    }

  }

  showItems (itemName) {
  }

  OnItemDeSelect(item: any) {
    if ( item.itemName === 'name') {
      this.state.name = false;
    } else if (item.itemName === 'link_code') {
      this.state.link_code = false;
    } else if (item.itemName === 'Client_id') {
      this.state.client_id = false;
    } else if (item.itemName === 'Model') {
      this.state.model = false;
    } else if (item.itemName === 'Dealer_Name') {
      this.state.dealer_name = false;
    } else if (item.itemName === 'IMEI') {
      this.state.imei = false;
    } else if (item.itemName === 'Simno') {
      this.state.simno = false;
    } else if (item.itemName === 'Status') {
      this.state.status = false;
    } else if (item.itemName === 'serial_number') {
      this.state.serial_number = false;
    } else if (item.itemName === 'Mac_address') {
      this.state.mac_address = false;
    } else if (item.itemName === 'device_id') {
      this.state.device_id = false;
    } else if (item.itemName === 'Start_date') {
      this.state.start_date = false;
    } else if (item.itemName === 'Expiry_date') {
      this.state.expiry_date = false;
    } else if (item.itemName === 'email') {
      this.state.email = false;
    } else if (item.itemName === 'online') {
      this.state.online = false;
    } else if (item.itemName === 's_dealer_name') {
      this.state.s_dealer_name = false;
    } else if (item.itemName === 'dealer_id') {
      this.state.dealer_id = false;
    } else if (item.itemName === 's_dealer') {
      this.state.s_dealer = false;
    }
    this.restService.postAdminSelectedItems(this.selectedItems);
  }

  onSelectAll(items: any) {
    this.i =  0;
    for ( this.i = 0; this.i < items.length; this.i++) {
      const item = items[this.i];
      if ( item.itemName === 'name') {
        this.state.name = true;
      } else if (item.itemName === 'link_code') {
        this.state.link_code = true;
      } else if (item.itemName === 'Client_id') {
        this.state.client_id = true;
      } else if (item.itemName === 'Model') {
        this.state.model = true;
      } else if (item.itemName === 'Dealer_Name') {
        this.state.dealer_name = true;
      } else if (item.itemName === 'IMEI') {
        this.state.imei = true;
      } else if (item.itemName === 'Simno') {
        this.state.simno = true;
      } else if (item.itemName === 'Status') {
        this.state.status = true;
      } else if (item.itemName === 'serial_number') {
        this.state.serial_number = true;
      } else if (item.itemName === 'Mac_address') {
        this.state.mac_address = true;
      } else if (item.itemName === 'device_id') {
        this.state.device_id = true;
      } else if (item.itemName === 'Start_date') {
        this.state.start_date = true;
      } else if (item.itemName === 'Expiry_date') {
        this.state.expiry_date = true;
      } else if (item.itemName === 'email') {
        this.state.email = true;
      } else if (item.itemName === 'online') {
        this.state.online = true;
      } else if (item.itemName === 's_dealer_name') {
        this.state.s_dealer_name = true;
      } else if (item.itemName === 'dealer_id') {
        this.state.dealer_id = true;
      } else if (item.itemName === 's_dealer') {
        this.state.dealer_id = true;
      }
    }
    setTimeout(() => {
    console.log(this.state);
    }, 1000);

    // save in db
    this.restService.postAdminSelectedItems(this.selectedItems);
 }

 onDeSelectAll(items: any) {
   this.state.name = false;
   this.state.link_code = false;
   this.state.client_id = false;
   this.state.model = false;
   this.state.dealer_name = false;
   this.state.imei = false;
   this.state.simno = false;
   this.state.status = false;
   this.state.serial_number = false;
   this.state.mac_address = false;
   this.state.device_id = false;
   this.state.start_date = false;
   this.state.expiry_date = false;
   //  console.log(this.state.expiry_date);
   this.state.email = false;
   this.state.online = false;
   this.state.s_dealer_name = false;
   this.state.dealer_id = false;
   this.state.s_dealer = false;
   setTimeout(() => {
     console.log(this.state);
   }, 1000);

   // save selected items on db
   this.restService.postAdminSelectedItems(this.selectedItems);
 }

  addDevice(device) {
    this.restService.addDevice(device);
  }

  onLogout() {
    this.restService.authSignOut();
  }

  async allDeviceView() {
    this.allDevice = [];
    //  this.spinnerService.show();
    const response = await this.restService.getUserDevice(Headers).toPromise();

    this.allDevice = response.data;

    this.allDevice.forEach( search => {
      if ( search.expiry_date != null && search.expiry_date !== '' ) {
        const time = search.expiry_date.split(' ');
        const time1 = time[1].split(':');
        search.expiry_date = time[0] + ' ' + time1[0] + ':' + time1[1];
        // console.log(search.expiry_date);
      }
      if ( search.start_date != null && search.start_date !== '') {
        const time = search.start_date.split(' ');
        const time1 = time[1].split(':');
        search.start_date = time[0] + ' ' + time1[0] + ':' + time1[1];
        //  console.log(search.start_date);
      }
    });
    this.allDeviceDummyList = this.allDevice;
    this.allDevice.forEach( ele => {
      if (ele.name == null || ele.name === ''  ) {
        ele.name = 'null';
      }
      if (ele.email == null || ele.email === ''  ) {
        ele.email = 'null';
      }
      if (ele.client_id == null || ele.client_id === '' ) {
        ele.client_id = 'null';
      }
      if (ele.link_code == null || ele.link_code === '' ) {
        ele.link_code = 'null';
      }
      if (ele.status == null || ele.status === '' ) {
        ele.status = 'null';
      }
      if (ele.device_id == null || ele.device_id === '' ) {
        ele.device_id = 'null';
      }
      if (ele.start_date == null || ele.start_date === '' ) {
        ele.start_date = 'null';
      }
      if (ele.expiry_date == null || ele.expiry_date === '' ) {
        ele.expiry_date = 'null';
      }
      if (ele.dealer_name == null || ele.dealer_name === '' ) {
        ele.dealer_name = 'null';
      }
      if (ele.imei == null || ele.imei === '' ) {
        ele.imei = 'null';
      }
      if (ele.simno == null || ele.simno === '' ) {
        ele.simno = 'null';
      }
      if (ele.online == null ||  ele.online === '' ) {
        ele.online = 'null';
      }
      if (ele.serial_number == null || ele.serial_number === '' ) {
        ele.serial_number = 'null';
      }
      if (ele.mac_address == null || ele.mac_address === '' ) {
        ele.mac_address = 'null';
      }
    });
    this.restService.authtoken(response);
    // });
  }

  showEditForm(dealer) {
      $.noConflict();
      // closeModal('#newrequestmodel');

      this.data = dealer;
      if (this.data.start_date === 'null' || this.data.start_date === null || this.data.start_date === '') {
        this.data.start_date = date;
      } else {
         this.data.start_date = dealer.start_date.split('T')[0];
      }
      if (this.data.expiry_date === 'null' || this.data.expiry_date.includes('NaN-NaN-NaN')) {
        this.data.expiry_date = '';
      }
      if (!this.data) {
        this.data.name = '';
        this.data.client_id = '';
        this.data.model = '';
        this.data.imei = '';
        this.data.s_dealer = '';
        this.data.status = '';
        this.data.online = '';
        this.data.expiry_date = '';
        this.data.start_date = '';
        this.data.ammount = '';
      } else {
        if (this.data.name === 'null') {
          this.data.name = '';
          console.log(this.data.name);
        }
        if (this.data.client_id === 'null') {
          this.data.client_id = '';
        }
        if (this.data.email === 'null') {
          this.data.email = '';
        }
        if (this.data.model === null) {
          this.data.model = '';
        }
      }
  }

  // update password
  updatePassDealer() {
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // Date format
  getdate(dd) {
    if (dd < 10) {
      dd = '0' + dd;
    } else {
      dd = dd;
    }
    return dd;
  }

  updateAdmin() {
    if (this.data.email === '' || this.data.name === '' ||  this.data.email === 'null' || this.data.name === 'null' ) {
      Swal({
       text: 'Please Fill Name And Email .... ',
       type: 'error',
        customClass: 'swal-height'
         }).then(okay => {
           return;
        });
    } else {
     // console.log(this.data);
      const extdate = new Date(this.data.expiry_date);
      // tslint:disable-next-line:max-line-length
      this.data.expiry_date = extdate.getFullYear() + '-' + this.getdate(extdate.getMonth() + 1) + '-' + this.getdate(extdate.getDate()) + ' ' + timest;
      console.log(this.data);
      if (this.data.expiry_date.trim() === null || this.data.expiry_date.trim() === ''
       || this.data.expiry_date.trim() === 'NaN-NaN-NaN Invalid' || this.data.expiry_date.split(' ')[0] === '1970-1-1') {
        console.log(this.data.expiry_date);
        this.data.expiry_date = '';
      }
      console.log(this.data.expiry_date);
      if (this.data.expiry_date.includes('NaN-NaN-NaN')) {
        this.data.expiry_date = '';
        console.log(this.data.expiry_date);
      }
      this.data.s_dealer = '';
      this.spinnerService.show();
      this.data.name = this.capitalize(this.data.name);
      this.restService.updateAdminDetails(this.data).subscribe((response) => {
        this.restService.authtoken(response);
        this.resp = response;
        if (this.resp.status === true) {
          this.spinnerService.hide();
          Swal({
          text: 'You have successfully Update details',
          type: 'success',
            customClass: 'swal-height'
            }).then(okay => {
            if (okay) {
              location.reload(true);
              }
            });
         //   this.spinnerService.hide();
        }
      });
      $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
    }
  }

  // suspend dealer-device
  suspendForm(device_id) {
    Swal({
      text: 'Are you sure to suspend the device?',
      showCancelButton: true,
      useRejections: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((okay) =>  {
      if (okay) {
        // location.reload(true);
        this.spinnerService.show();
        this.restService.suspendForm(device_id).subscribe((response) => {
       //   this.spinnerService.hide();
          this.restService.authtoken(response);
          this.resp = response;
          if (this.resp.status === true) {
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
        this.spinnerService.hide();
      }
    });
  }

  // activate admin-device
  activateForm(device_id) {
    // console.log(device_id);
    Swal({
      text: 'Are you sure to activate the device?',
      showCancelButton: true,
      useRejections: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((okay) =>  {
      if (okay) {
        this.spinnerService.show();
        this.restService.activateForm(device_id).subscribe((response) => {
          // this.spinnerService.hide();
          this.restService.authtoken(response);
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
          // this.spinnerService.hide();
        });
      }
    });
  }

  // Unlink dealer-device
  unlinkUser(device_id) {
    Swal({
      text: 'Are you sure to unlink the device?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((result) =>  {
      this.spinnerService.show();
      if (result.value) {
        this.restService.unlinkUser(device_id);
        this.spinnerService.hide();
      }
    });
  }

  deleteUserDetails(device_id) {
    console.log(device_id);
     Swal({
        text: 'Are you sure delete this user?',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        type: 'warning'
      }).then((result) =>  {
        this.spinnerService.show();
      this.restService.deleteAdminUser(device_id);
      this.spinnerService.hide();
      location.reload(true);
    });
  }

  // For any search
  searchDevice(value) {
    const list = this.allDeviceDummyList;
    this.allDevice = [];
    list.forEach( ele => {
      if (ele.name.toUpperCase().includes(value.toUpperCase()) || ele.email.toUpperCase().includes(value.toUpperCase()) ||
      ele.client_id.toUpperCase().includes(value.toUpperCase()) || ele.link_code.toUpperCase().includes(value.toUpperCase()) ||
      ele.status.toUpperCase().includes(value.toUpperCase()) || ele.device_id.toUpperCase().includes(value.toUpperCase()) ||
      ele.start_date.toUpperCase().includes(value.toUpperCase()) || ele.expiry_date.toUpperCase().includes(value.toUpperCase()) ||
      ele.dealer_name.toUpperCase().includes(value.toUpperCase()) || ele.imei.toUpperCase().includes(value.toUpperCase()) ||
      ele.simno.toUpperCase().includes(value.toUpperCase()) || ele.online.toUpperCase().includes(value.toUpperCase()) ||
      ele.serial_number.toUpperCase().includes(value.toUpperCase()) ||
      ele.mac_address.toUpperCase().includes(value.toUpperCase())) {
        this.allDevice.push(ele);
      }
    });
  }

  searchField(field){
    const list = this.allDeviceDummyList;
    this.allDevice = [];
    var name = field.target.name;
    var value = field.target.value;

    list.forEach( ele => {

      if(name=="name" && ele.name.toUpperCase().includes(value.toUpperCase())){
        console.log(name);
        this.allDevice.push(ele);
        console.log(this.allDevice);
      }else if(name=="email" && ele.email.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="client_id" && ele.client_id.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="status" && ele.status.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="device_id" && ele.device_id.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="start_date" && ele.start_date.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="expiry_date" && ele.expiry_date.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="dealer_name" && ele.dealer_name.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="imei" && ele.imei.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="sim" && ele.simno.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="online" && ele.online!=null && ele.online.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="serial_number" && ele.serial_number!=null && ele.serial_number.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="mac_address" && ele.mac_address!=null && ele.mac_address.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="dealer_id" && ele.dealer_id!=null && ele.dealer_id.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="dealer_pin" && ele.link_code!=null && ele.link_code.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }else if(name=="model" && ele.model!=null && ele.model.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }

    });
  }

  deviceFilter(elem){
    const list = this.allDeviceDummyList;
    this.allDevice = [];
    //var name = elem.target.name;
    var value = elem.target.value;
    list.forEach( ele => {
      if( ele.status.toUpperCase().includes(value.toUpperCase())){
        this.allDevice.push(ele);
      }
    });

  }
  paging(elem){
    var value = elem.target.value;
    this.perPage=value;
  }
  childInputChanged(value){
    const list = this.allDeviceDummyList;
    this.allDevice = [];
    list.forEach( ele => {
      if (ele.name.toUpperCase().includes(value.toUpperCase()) || ele.email.toUpperCase().includes(value.toUpperCase()) ||
      ele.client_id.toUpperCase().includes(value.toUpperCase()) || ele.link_code.toUpperCase().includes(value.toUpperCase()) ||
      ele.status.toUpperCase().includes(value.toUpperCase()) || ele.device_id.toUpperCase().includes(value.toUpperCase()) ||
      ele.start_date.toUpperCase().includes(value.toUpperCase()) || ele.expiry_date.toUpperCase().includes(value.toUpperCase()) ||
      ele.dealer_name.toUpperCase().includes(value.toUpperCase()) || ele.imei.toUpperCase().includes(value.toUpperCase()) ||
      ele.simno.toUpperCase().includes(value.toUpperCase()) || ele.online.toUpperCase().includes(value.toUpperCase()) ||
      ele.serial_number.toUpperCase().includes(value.toUpperCase()) ||
      ele.mac_address.toUpperCase().includes(value.toUpperCase())) {
        this.allDevice.push(ele);
      }
    });
  }
}
