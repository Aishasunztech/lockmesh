import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { HelperService } from '../../../services/helper.service';
import { RestService } from '../../../services/rest.service';
import { GlobalSearchService } from '../../../services/global-search.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';

const today = new Date();
// tslint:disable-next-line:max-line-length
const timest = (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes());
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timest;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profile: any = {
    dealer_name: '',
    dealer_id: '',
    dealer_email: '',
    link_code: '',
    tokens: '',
  };
  resp: any;
  allDevice: any;
  componentName : string;
  isComponentAllowed = false;
  isAdmin=false;
  userType:any;
  newRequest=0;
  searchFilterValue: any;
  data: any = {
    name: '',
    email: '',
    client_id: '',
    dealer_id: '',
    sim_id:'',
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
    private route: ActivatedRoute,
    public router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
    location: Location,
    private acl: HelperService,
    private spinnerService: Ng4LoadingSpinnerService,
    private globalSearch: GlobalSearchService
  ) {

  }

 
  async ngOnInit() {
    if ( this.restService.sessionLogin('email') === null || this.restService.sessionLogin('token') === null ) {
        this.router.navigate(['/login']);
    }else{
      this.spinnerService.show();
      
      this.componentName=this.route.snapshot.data['componentName'];
      // console.log("componentName: "+ this.componentName);
      // alert("componentName: "+ this.componentName);

      
      await this.aclHandler();
      
      this.profilelist();

      await this.allDeviceView();

      this.userType =window.localStorage.getItem('type').replace(/['"]+/g, '');
      this.spinnerService.hide();
      
      this.globalSearch.deviceInfo.subscribe((device)=>{
        this.showEditForm(device);
      });
    }
    
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

  updateAdmin() {
    if (this.data.email === '' || this.data.name === '' || this.data.email === 'null' || this.data.name === 'null' || this.data.expiry_date ==='' || this.data.expiry_date === 'null') {
      Swal({
       text: 'Please provide Name, Email and Expiry Date ',
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
  profilelist() {
    this.restService.profilelist().subscribe((response) => {
      this.profile = response;
    });
  }

  async allDeviceView() {
    const response = await this.restService.getUserDevice(Headers).toPromise();
    this.allDevice = response.data;
    this.newRequest = 0;
    response.data.forEach( search => {
      if (search.device_status == 0 && search.dealer_id != 0 && search.unlink_status == 0){
        this.newRequest = this.newRequest + 1;
      }
    });
    this.restService.authtoken(response);
  }

  async aclHandler(){

    const response1 = await this.restService.isAdmin().toPromise();
    console.log("headerComponent");
    console.log(response1);
    this.isAdmin = response1.isAdmin;
  }
  async refreshRequest(e){
    await this.allDeviceView();
  }
  searchFilter(e){
    this.searchFilterValue = e.target.value;
    // this.globalSearch.emit(this.searchFilterValue);
    this.globalSearch.globalSearchFunc(this.searchFilterValue);
  }
  onLogout() {
    this.restService.authSignOut();
  }
}
