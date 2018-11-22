import { Component, OnInit } from '@angular/core';
import { RestService } from './../rest.service';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {

  constructor(private restService: RestService) { }

  ngOnInit() {
    document.body.style.zoom = '100%';
  }
  onLogout() {
    this.restService.authSignOut();
  }
}
