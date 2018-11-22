import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../../rest.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router} from '@angular/router';
import { Alert } from 'selenium-webdriver';
// import {DataTableModule} from 'angular-6-datatable';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


const today = new Date();
// tslint:disable-next-line:max-line-length
const timest = (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes());
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timest;
@Component({
  selector: 'app-dealer-devices',
  templateUrl: './dealer-devices.component.html',
  styleUrls: ['./dealer-devices.component.css']
})

export class DealerDevicesComponent implements OnInit {
  @ViewChild('inputBox') _el: ElementRef;
  allSDelears: any = [];
  private resp: any = null;
  public allSubDealers = [];
  sdealer = false;
  i = 0;
  msg = '';
  // sorting
  key = 'status'; // set default
  reverse = true;
  // initializing p to one
  p = 1;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = [];
  allDeviceDummyList = [];
  d: any = null;
  x: any = null;
  alldealerDevice: any = [];
  vals: any = '';

  state: any = {
    name: false,
    email: false,
    client_id: false,
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
    s_dealer: false,
    s_dealer_name: false
  };
  data: any = {
    name: '',
    email: '',
    client_id: '',
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

  constructor(private restService: RestService, private router: Router,
  private spinnerService: Ng4LoadingSpinnerService ) { }
  @ViewChild('deviceData') projectForm: NgForm;

  async  ngOnInit() {
    console.log(this.restService.sessionLogin('token'));
    this.spinnerService.show();
    await this.alldealerDeviceView();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
    document.body.style.zoom = '40%';
  // const _this = this;
    $('#tablescroll').css('height', ($( window ).height() - $('#navbar').height() - 65));
    $('#tablescroll').css('height', ($( window ).height() - $('#navbar').height() - 65));
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
      {'id': 12, 'itemName': 'Sim'},
      {'id': 13, 'itemName': 'online'},
      {'id': 14, 'itemName': 'Serial_No'},
      {'id': 15, 'itemName': 'Mac'},
      {'id': 16, 'itemName': 's_dealer'},
      {'id': 17, 'itemName': 's_dealer_name'}
    ];
    await this.getSelectedItems();
    this.dropdownSettings = {
      text: 'Display',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      classes: 'myclass custom-class',
      showCheckbox: true
    };
    this.allsdealers();
  }
  // get dealer selected device items
async getSelectedItems() {
  console.log('getAdminSelectedItems;- ');
  const response = await this.restService.getDealerSelectedItems(Headers).toPromise();
  console.log(response);

  if (response.status === true) {
    response.data = JSON.parse(response.data);
    const alength = response.data.length;
    for (this.i = 0; this.i < alength; this.i++) {
      this.onItemSelect(response.data[this.i], 'initVal');
      this.selectedItems.push(response.data[this.i]);
    }
  }
}

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  onItemSelect(item: any, initVal) {
    console.log(item);
    console.log(this.selectedItems);
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
  } else if (item.itemName === 'Sim') {
    this.state.simno = true;
    console.log( this.state.simno);
  } else if (item.itemName === 'Status') {
    this.state.status = true;
  } else if (item.itemName === 'Serial_No') {
    this.state.serial_number = true;
  } else if (item.itemName === 'Mac') {
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
  } else if (item.itemName === 's_dealer') {
    this.state.s_dealer = true;
  } else if (item.itemName === 's_dealer_name') {
    this.state.s_dealer_name = true;
    console.log( this.state.s_dealer_name);
  }
  // update selected items for dealer
  if (initVal == null) {
    this.restService.postDealerSelectedItems(this.selectedItems);
  }
}
showItems (itemName) {

}
OnItemDeSelect(item: any) {
 // alert('Deselect');
    console.log(item);
 //   console.log(this.selectedItems);
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
  } else if (item.itemName === 'Sim') {
    this.state.simno = false;
  } else if (item.itemName === 'Status') {
    this.state.status = false;
  } else if (item.itemName === 'Serial_No') {
    this.state.serial_number = false;
  } else if (item.itemName === 'Mac') {
    this.state.mac_address = false;
  } else if (item.itemName === 'device_id') {
    this.state.device_id = false;
  } else if (item.itemName === 'Start_date') {
    this.state.start_date = false;
  } else if (item.itemName === 'Expiry_date') {
    this.state.expiry_date = false;
    console.log(this.state.expiry_date);
  } else if (item.itemName === 'email') {
    this.state.email = false;
  } else if (item.itemName === 'online') {
    this.state.online = false;
  } else if (item.itemName === 's_dealer') {
    this.state.s_dealer = false;
  } else if (item.itemName === 's_dealer_name') {
    this.state.s_dealer_name = false;
    console.log(this.state.s_dealer_name);
  }

  this.restService.postDealerSelectedItems(this.selectedItems);
}
onSelectAll(items: any) {
    console.log(items);
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
  } else if (item.itemName === 'Sim') {
    this.state.simno = true;
  } else if (item.itemName === 'Status') {
    this.state.status = true;
  } else if (item.itemName === 'Serial_No') {
    this.state.serial_number = true;
  } else if (item.itemName === 'Mac') {
    this.state.mac_address = true;
  } else if (item.itemName === 'device_id') {
    this.state.device_id = true;
  } else if (item.itemName === 'Start date') {
    this.state.start_date = true;
    console.log(this.state.start_date);
  } else if (item.itemName === 'Expiry_date') {
    this.state.expiry_date = true;
  //  console.log(this.state.expiry_date);
  } else if (item.itemName === 'email') {
    this.state.email = true;
  } else if (item.itemName === 'online') {
    this.state.online = true;
  } else if (item.itemName === 's_dealer') {
    this.state.s_dealer = true;
  } else if (item.itemName === 's_dealer_name') {
    this.state.s_dealer_name = true;
    console.log(this.state.s_dealer_name);
  }
  }
  setTimeout(() => {
  console.log(this.state);
  }, 1000);

  this.restService.postDealerSelectedItems(this.selectedItems);
}
onDeSelectAll(items: any) {
  console.log(items);
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
  console.log(this.state.start_date);

  this.state.expiry_date = false;
//  console.log(this.state.expiry_date);

  this.state.email = false;

  this.state.online = false;
  this.state.s_dealer = false;
  this.state.s_dealer = false;

  setTimeout(() => {
  console.log(this.state);
  }, 1000);

  this.restService.postDealerSelectedItems(this.selectedItems);
}

async alldealerDeviceView() {
  const id =  this.restService.sessionLogin('id');
  console.log(id);
  this.spinnerService.show();
  await this.restService.getUserDealerDevice(id).subscribe((response) => {
  console.log('all dealer devices');
  console.log(response);
  this.spinnerService.hide();
  this.alldealerDevice = response.data;
  if (response.status === false && (response.msg === 'Account deleted' || response.msg === 'Account suspended')) {
    Swal({
    text: response.msg,
    type: 'warning',
      customClass: 'swal-height'
      }).then(result => {
      if (result.value) {
        location.reload(true);
        }
        this.router.navigate(['/dealer/login']);
      });
  } else if ( response.status === false && response.msg === 'No devices linked') {
this.msg = response.msg;
  } else if (response.status === true ) {
    this.alldealerDevice.forEach( search => {
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
    this.checkForNull();
  }
    this.restService.authtoken(response);
  });
}

allsdealers() {
  const id =  this.restService.sessionLogin('id');
  this.restService.getUserSubDealers(id).subscribe((response) => {
    this.allSubDealers = response;
      console.log('all sub dealers');
      console.log(this.allSubDealers);
      const resp = this.allSubDealers;
  });
}

onLogout() {
  this.restService.authdealerSignOut();
}

showEditForm(dealer, type?: string) {
  console.log(dealer);
  this.data = dealer;
  this.sdealer = false;
  if (dealer.s_dealer === null || dealer.s_dealer === '') {
    this.sdealer = false;
  } else if (type === 'edit' && dealer.s_dealer !== '' ) {
    console.log(dealer.s_dealer);
    this.sdealer = true;
  }
  if (this.data.start_date === 'null' || this.data.start_date === null || this.data.start_date === '') {
    this.data.start_date = date;
    console.log(this.data.start_date);
  } else {
     this.data.start_date = dealer.start_date.split('T')[0];
  }
  if (this.data.expiry_date === 'null'  || this.data.expiry_date.includes('NaN-NaN-NaN')) {
    this.data.expiry_date = '';
    console.log(this.data.expiry_date);
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
updateDealer() {
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
    if (this.data.s_dealer === null) {
      this.data.s_dealer = '';
    }
    this.spinnerService.show();
    this.data.name = this.capitalize(this.data.name);
    this.restService.updateDealerDetails(this.data).subscribe((resp) => {
       console.log(this.resp);
        this.resp = resp;
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
  activateForm(device_id) {
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
        this.resp = response;
     //   this.spinnerService.hide();
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
unlinkUser(device_id) {
  console.log(device_id);
  Swal({
    text: 'Are you sure to unlink the device?',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    type: 'warning'
  }).then((result) =>  {
    if (result.value) {
      this.spinnerService.show();
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
      if (result.value) {
        this.spinnerService.show();
        this.restService.deleteUser(device_id);
        this.spinnerService.hide();
      }
    });
  }

  // for Any search
  searchDevice(value) {
    console.log(value);
    const list = this.allDeviceDummyList;
    this.alldealerDevice = [];
      list.forEach( ele => {
            if (ele.name.toUpperCase().includes(value.toUpperCase()) || ele.email.toUpperCase().includes(value.toUpperCase()) ||
                ele.client_id.toUpperCase().includes(value.toUpperCase()) || ele.link_code.toUpperCase().includes(value.toUpperCase()) ||
                ele.status.toUpperCase().includes(value.toUpperCase()) || ele.device_id.toUpperCase().includes(value.toUpperCase()) ||
                ele.start_date.toUpperCase().includes(value.toUpperCase()) || ele.expiry_date.toUpperCase().includes(value.toUpperCase()) ||
                ele.dealer_name.toUpperCase().includes(value.toUpperCase()) || ele.imei.toUpperCase().includes(value.toUpperCase()) ||
                ele.simno.toUpperCase().includes(value.toUpperCase()) || ele.online.toUpperCase().includes(value.toUpperCase()) ||
                ele.serial_number.toUpperCase().includes(value.toUpperCase()) ||
                ele.mac_address.toUpperCase().includes(value.toUpperCase())) {
                this.alldealerDevice.push(ele);
                }
      });
      console.log(this.alldealerDevice);
    }

    checkForNull() {
      this.allDeviceDummyList = this.alldealerDevice;
      this.alldealerDevice.forEach( ele => {
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
    }
}
