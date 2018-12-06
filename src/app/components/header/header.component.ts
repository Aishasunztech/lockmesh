import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {HelperService} from '../../helper.service';
import { RestService } from '../../rest.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  componentName : string;
  isComponentAllowed = false;
  isAdmin=false;
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

      if(this.isComponentAllowed==false){
        this.onLogout();
      }
    }
  }

  async aclHandler(){
    // this.isComponentAllowed =
    const response = await this.restService.isComponentAllowed(this.componentName).toPromise();
    this.isComponentAllowed=response.componentAllowed;
    const response1 = await this.restService.isAdmin().toPromise();
    this.isAdmin = response1.isAdmin;
    console.log(this.isAdmin);
  }

  onLogout() {
    this.restService.authSignOut();
  }
}
