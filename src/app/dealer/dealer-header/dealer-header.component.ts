import { Component, OnInit , Inject } from '@angular/core';
import { RestService } from '../../rest.service';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';


@Component({
  selector: 'app-dealer-header',
  templateUrl: './dealer-header.component.html',
  styleUrls: ['./dealer-header.component.css']
})
export class DealerHeaderComponent implements OnInit {
  username: any = '';
profile: any = {
  dealer_name: '',
  dealer_id: '',
  dealer_email: '',
  link_code: '',
  tokens: '',
};
  constructor(private restService: RestService, public router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {}

  ngOnInit() {
    this.username = this.restService.sessionLogin('name');
    if (this.restService.sessionLogin('email') === null ) {
        this.router.navigate(['/dealer/login']);
      }
      this.profilelist();
  }

  profilelist() {
    this.restService.profilelist().subscribe((response) => {
      this.profile = response;
        console.log(this.profile);
    });
  }
  onLogout() {
    this.restService.authSignOut();
  }
}
