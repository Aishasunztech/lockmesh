import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  private resp: any = null;

  constructor(private restService: RestService) { }

  ngOnInit() {
    document.body.style.zoom = '100%';
  }

  addDevice(device) {
    // this.restService.addDevice(device).subscribe((resp) => {
    //   console.log(this.resp);
    //   // const resp = JSON.parse(response['body']);
    //     // console.log(resp);
    //     this.resp = resp;
    //     if (this.resp.status === true) {
    //       Swal({
    //       text: 'You have successfully add devices',
    //       type: 'success',
    //         customClass: 'swal-height'
    //         }).then(okay => {
    //         if (okay) {
    //           location.reload(true);
    //           }
    //       });
    //     }
    // });
  }
}
