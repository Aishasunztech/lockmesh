import { Component, OnInit } from '@angular/core';
import { RestService } from '../../rest.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dealer-add-devices',
  templateUrl: './dealer-add-devices.component.html',
  styleUrls: ['./dealer-add-devices.component.css']
})
export class DealerAddDevicesComponent implements OnInit {
  private resp: any = null;

  constructor(private restService: RestService,  private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    document.body.style.zoom = '100%';
  }

  addDealerdevices(device) {
    this.spinnerService.show();
    this.restService.addDealerdevices(device).subscribe((resp) => {
      this.spinnerService.hide();
      console.log(this.resp);
        this.resp = resp;
        if (this.resp.status === true) {
          Swal({
          text: 'You have successfully add devices',
          type: 'success',
            customClass: 'swal-height'
            }).then(okay => {
            if (okay) {
              location.reload(true);
              }
          });
        }
    });
  }
}

