import { Component, OnInit } from '@angular/core';
import { RestService } from '../../rest.service';

@Component({
  selector: 'app-sdealerprofile',
  templateUrl: './sdealerprofile.component.html',
  styleUrls: ['./sdealerprofile.component.css']
})
export class SdealerprofileComponent implements OnInit {
  public sdealerprofile: any = {
    connected_dealer: '',
    link_code: '',
    sdealer_email: '',
    sdealer_id: '',
    sdealer_name: ''
  };

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.sdealerprofilelist();
    document.body.style.zoom = '100%';
  }
  onLogout() {
    this.restService.authSdealerSignOut();
  }

sdealerprofilelist() {
  this.restService.sdealerprofilelist().subscribe((response) => {
    this.sdealerprofile = response;
      console.log(this.sdealerprofile);
  });
}

}
