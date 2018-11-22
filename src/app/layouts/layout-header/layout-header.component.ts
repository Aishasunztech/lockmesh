import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.css']
})
export class LayoutHeaderComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	ngAfterViewInit() {
	    if($(window).width() > 768){
		    $(function(){
		    $(".mega-dropdown").hover(function() {
		        $('.dropdown-menu', this).stop( true, true ).fadeIn("fast");
		        $(this).toggleClass('open');
		    },
		    function() {
		        $('.dropdown-menu', this).stop( true, true ).fadeOut("fast");
		        $(this).toggleClass('open');
		    });
		    });
		}
	}
}
