import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { HelperService } from '../../helper.service';
import { RestService } from '../../rest.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';

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
  componentName : string;
  isComponentAllowed = false;
  isAdmin=false;
  userType:any;
  newRequest=0;
  searchFilterValue: any;
  @Output() globalSearch = new EventEmitter<Event>();

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService ,
    location: Location,
    private acl: HelperService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {

  }

  async ngOnInit() {
    if (
      this.restService.sessionLogin('email') === null ||
      this.restService.sessionLogin('token') === null
    ) {
        this.router.navigate(['/login']);
    }else{

      this.componentName=this.route.snapshot.data['componentName'];

      this.spinnerService.show();
      await this.aclHandler();
      setTimeout(() => {
      this.spinnerService.hide();
      }, 1000);

      this.spinnerService.show();
      this.profilelist();
      this.spinnerService.hide();

      this.spinnerService.show();
      await this.allDeviceView();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);

      if(this.isComponentAllowed==false || this.componentName=="InvalidPage"){
        this.router.navigate(['/invalid_page/denied']);
      }

      this.spinnerService.show();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);
      this.userType =window.localStorage.getItem('type').replace(/['"]+/g, '');

    }
    const delay = ms => new Promise(res => setTimeout(res, ms));
    this.spinnerService.show();
    await delay(5000);
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
  }
  profilelist() {
    this.restService.profilelist().subscribe((response) => {
      this.profile = response;
    });
  }

  async allDeviceView() {
    const response = await this.restService.getUserDevice(Headers).toPromise();

    response.data.forEach( search => {
      if(search.device_status==0){
        this.newRequest = this.newRequest + 1;
      }
    });
    this.restService.authtoken(response);
  }

  async aclHandler(){
    // this.isComponentAllowed =
    const response = await this.restService.isComponentAllowed(this.componentName).toPromise();
    this.isComponentAllowed=response.componentAllowed;
    const response1 = await this.restService.isAdmin().toPromise();
    this.isAdmin = response1.isAdmin;
  }

  searchFilter(e){
    this.searchFilterValue = e.target.value;
    this.globalSearch.emit(this.searchFilterValue);
  }
  onLogout() {
    this.restService.authSignOut();
  }
}
