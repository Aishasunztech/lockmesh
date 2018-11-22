import { Component, OnInit } from '@angular/core';
import { RestService } from '../../rest.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit {

  constructor(private restService: RestService) { }

  ngOnInit() {
    document.body.style.zoom = '100%';
  }

  onLogout() {
    this.restService.authSignOut();
  }

}
