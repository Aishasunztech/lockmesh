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
    
      // alert(this.isComponentAllowed);

      // if(this.isComponentAllowed==false || this.componentName=="InvalidPage"){
      //   this.router.navigate(['/invalid_page/denied']);
      // }

      
      // this.userType =window.localStorage.getItem('type').replace(/['"]+/g, '');
      // this.spinnerService.hide();
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
      if (search.device_status == 0 && search.dealer_id != 0 && search.unlink_status == 0){
        this.newRequest = this.newRequest + 1;
      }
    });
    this.restService.authtoken(response);
  }

  async aclHandler(){
    // this.isComponentAllowed =
    // const response = await this.restService.isComponentAllowed(this.componentName).toPromise();
    // this.isComponentAllowed=response.componentAllowed;
    // alert("component allowed "+ this.isComponentAllowed);
    const response1 = await this.restService.isAdmin().toPromise();
    this.isAdmin = response1.isAdmin;
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
