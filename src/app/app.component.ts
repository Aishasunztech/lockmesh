import { Component, Inject, OnInit } from '@angular/core';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'my-admin';
  public data: any = [ ];

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,private spinnerService: Ng4LoadingSpinnerService) {

  }
  ngOnInit(){
    // this.spinnerService.show();
    // setTimeout(() => {
    //   this.spinnerService.hide();
    // }, 90000);

  }

}
