import { Component, OnInit, Inject } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { RestService } from '../../rest.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private restService: RestService, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  ngOnInit() {
    if (this.restService.sessionLogin('email') === null ) {
        this.router.navigate(['/login']);
      }
      
  }

  onLogout() {
    this.restService.authSignOut();
  }
}
