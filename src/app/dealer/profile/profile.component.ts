import { Component, OnInit } from '@angular/core';
import { RestService } from '../../rest.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profile: any = {
    dealer_name: '',
    dealer_id: '',
    dealer_email: '',
    link_code: '',
    tokens: '',
  };

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.profilelist();
  }
  onLogout() {
    this.restService.authdealerSignOut();
  }

  profilelist() {
    this.restService.profilelist().subscribe((response) => {
      this.profile = response;
        console.log(this.profile);
    });
  }

}
