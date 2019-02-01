import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-invalid_page',
  templateUrl: './invalid_page.component.html',
  styleUrls: ['./invalid_page.component.css']
})
export class InvalidPage implements OnInit {
  path: any;
  error_no: any;
  err_caption: any;
  constructor(private restService: RestService, private router: Router) {}

  ngOnInit() {
    this.path = this.router.url.split('/');
    var type = this.path[2];
    if(type == 'denied'){
      this.error_no = 3; // 403
      this.err_caption = 'PERMISSOIN DENIED'
    }else{
      this.error_no = 4; // 404
      this.err_caption = 'THE PAGE YOU REQUESTED COULD NOT FOUND';
    }
  }
  onLogout() {
    this.restService.authSignOut();
  }
}
