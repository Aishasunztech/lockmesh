import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
// import { RestService } from '../services/rest.service';
// import Swal from 'sweetalert2';
// import { NgForm } from '@angular/forms';
// import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Router , ActivatedRoute } from '@angular/router';
// import * as enLocale from 'date-fns/locale/en';
// import * as $ from 'jquery';

// import { DatepickerOptions } from 'ng2-datepicker';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {
    
  }

  ngOnInit() {
    let url = this.router.url;
    if(url=="/"){
      this.router.navigate(['/devices']);
    }
  }
}
