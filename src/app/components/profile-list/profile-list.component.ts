import { Component, OnInit, Inject} from '@angular/core';
import { RestService } from '../../rest.service';
import Swal from 'sweetalert2';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Common } from '../../entity/common';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css']
})
export class ProfileListComponent implements OnInit {

  profileType:string;
  path;
  profiles=[];
  isAdmin=false;
  mainProfiles=[];
  dealer_id=0;
  userType:string;
  connected_dealer;

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private spinnerService: Ng4LoadingSpinnerService,
    private common: Common
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.profiles=[];
      this.path = this.router.url.split('/');
      this.profileType = this.path[2];

      this.dealer_id = Number(window.localStorage.getItem("id"));

      if (window.localStorage.getItem("type").replace(/"/g, "") == "admin") this.isAdmin = true;

      this.userType = window.localStorage.getItem("type").replace(/"/g, "");

      this.connected_dealer = Number(window.localStorage.getItem("connected_dealer"));

      console.log(this.profileType);
      this.getProfiles();
      console.log("profiles");
      console.log(this.profiles);
    });

   
  }
  getProfiles() {
    this.spinnerService.show();

    if (this.isAdmin) {
      // all policies, all profiles
      this.restService.getProfiles().subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == this.profileType) {
            this.profiles.push(elem);
          }
        });
        console.log(this.profiles);

        this.restService.authtoken(response);
      });

    } else if (this.userType == "dealer") {
      // all policies, his profiles
      this.restService.getProfiles(this.dealer_id).subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == this.profileType) {
            console.log(elem.type);
            this.profiles.push(elem);
          }
        });

        this.restService.authtoken(response);
      });

    } else if (this.userType == "sdealer") {

      this.restService.getProfiles(this.connected_dealer).subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == this.profileType) {
            this.profiles.push(elem);
          }
        });

        this.restService.authtoken(response);

      });

    }
    this.spinnerService.hide();
  }
  deleteProfile(event, profileId){
    Swal({
      text: 'Are you sure to suspend the device?',
      showCancelButton: true,
      useRejections: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((okay) => {
      if (okay) {
        this.spinnerService.show();
        this.restService.deleteProfile(profileId);
        location.reload(true);
        this.spinnerService.hide();
      }
    });
    console.log(profileId);
  }
  onLogout() {
    // this.sockets.disconnect();
    this.restService.authSignOut();
  }
}
