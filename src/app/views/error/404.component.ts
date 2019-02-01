import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: '404.component.html'
})
export class P404Component {
    err_caption="";
    constructor(
        private route: ActivatedRoute,
        public router: Router
    ) {
        this.err_caption=this.route.snapshot.data['description'];
    }

}