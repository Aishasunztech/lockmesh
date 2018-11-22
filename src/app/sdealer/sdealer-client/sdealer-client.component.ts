import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sdealer-client',
  templateUrl: './sdealer-client.component.html',
  styleUrls: ['./sdealer-client.component.css']
})
export class SdealerClientComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.body.style.zoom = '100%';
  }

}
