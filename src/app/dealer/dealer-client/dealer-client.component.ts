import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dealer-client',
  templateUrl: './dealer-client.component.html',
  styleUrls: ['./dealer-client.component.css']
})
export class DealerClientComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.body.style.zoom = '100%';
  }

}
