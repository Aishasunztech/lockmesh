import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, RequestMethod} from '@angular/http';
@Injectable()
export class Common {

   baseurl: String = 'http://localhost:3000';
   //baseurl: String = 'http://54.224.247.87:3000';
   // baseurl: String = 'http://192.168.0.127:3000';
}
