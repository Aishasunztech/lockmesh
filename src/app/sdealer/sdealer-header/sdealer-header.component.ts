import { Component, OnInit , Inject } from '@angular/core';
import { RestService } from '../../rest.service';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-sdealer-header',
  templateUrl: './sdealer-header.component.html',
  styleUrls: ['./sdealer-header.component.css']
})
export class SdealerHeaderComponent implements OnInit {
  username: any = '';
 public profile: any = {
    connected_dealer: '',
    link_code: '',
    sdealer_email: '',
    sdealer_id: '',
    sdealer_name: ''
  };

  constructor(private restService: RestService, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit() {
    this.username = this.restService.sessionLogin('name');
    if (this.restService.sessionLogin('email') === null ) {
        this.router.navigate(['/sdealer/login']);
      }
      this.profilelist();
  }

  onLogout() {
    this.restService.authSdealerSignOut();
  }

  profilelist() {
    this.restService.sdealerprofilelist().subscribe((response) => {
      this.profile = response;
        console.log(this.profile);
    });
  }

}
