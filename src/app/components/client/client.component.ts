import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  constructor(private restService: RestService) { }

  ngOnInit() {
  }
  onLogout() {
    this.restService.authSignOut();
  }
}
