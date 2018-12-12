import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {HelperService} from '../../helper.service';
import { RestService } from '../../rest.service';
import { GlobalSearchService } from '../../global-search.service';
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
    private acl: HelperService
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

      //this.spinnerService.show();
      await this.aclHandler();
      setTimeout(() => {
        //this.spinnerService.hide();
      }, 1000);
      this.profilelist();

      await this.allDeviceView();
      setTimeout(() => {
        //this.spinnerService.hide();
      }, 1000);

      if(this.isComponentAllowed==false){
        this.router.navigate(['/invalid_page/denied']);
        //this.onLogout();
      }
      this.userType =window.localStorage.getItem('type').replace(/['"]+/g, '');
    }
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
    //this.globalSearch.setGlobalSearchFilterValue(this.searchFilterValue);
    this.globalSearch.emit(this.searchFilterValue);
  }
  onLogout() {
    this.restService.authSignOut();
  }
}
