import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Common } from '../entity/common';
import { Console } from '@angular/core/src/console';
import {Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { settings } from 'cluster';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  token: String;
  authorization: String = '';
  response: any = {
    msg: ''
  };
  headers: any;
  oHeaders: any;

  constructor(
    private http: HttpClient,
    private curl: Common,
    private router: Router,
    private activeRouter: ActivatedRoute, @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.headers  = new HttpHeaders();
    // this.headers.set('Access-Control-Allow-Origin','*');
    this.headers.set("authorization",this.sessionLogin('token'));
    this.oHeaders = {
      headers:{
        authorization: this.sessionLogin('token'),
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
  dlogin(dealer_id){

  }
  dealerLogin(dealer_id): Observable<any> {
    return this.http.post(this.baseUrl + '/users/Login', this.oHeaders);
  }
  setHeaders(token){
    console.log("setHeaders()");
    console.log(this.oHeaders);
    this.oHeaders.headers.authorization = token;
  }
  private baseUrl = this.curl.baseurl;

  // Session
  sessionLogin(key) {
    return this.storage.get(key);
  }

  isComponentAllowed(componentName){
    var self = this;
    //this.headers.set("authorization", this.sessionLogin('token'));
    this.setHeaders(this.sessionLogin('token'));
    this.response= this.http.get(this.baseUrl + '/users/check_component/' + componentName, this.oHeaders);
    return this.response;
   }

  isAdmin(){
    var self = this;
    this.setHeaders(this.sessionLogin('token'));

    this.response= this.http.get(this.baseUrl + '/users/check_admin',this.oHeaders);
    return this.response;
  }
  // for admin
  getUserDevice(headers) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/devices', this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // for sdealer list
  sdealerlist(dealer_id) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/ /sdealers/' + dealer_id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // For Dealer(devices)
  getUserDealerDevice(id) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/dealer/devices/' + id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // For Dealer(devices)
  getUserSubDealerDevice(id) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/dealer/devices/' + id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

   // For Dealer(devices)
  getUserSDealerDevice(id) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/dealer/devices/' + id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // For Dealer update
  updateDealerDetails(dealer) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.put(this.baseUrl + '/users/edit/devices', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // For Admin update
  updateAdminDetails(dealer) {
    console.log(dealer);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.put(this.baseUrl + '/users/edit/devices', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // For dealer(admin dashboard)
  updateAdminDealerDetails(dealer) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.put(this.baseUrl + '/users/edit/dealers', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // For Apk edit(admin dashboard)
  updateApkDetails(apk_name, logo, apk, apk_id) {
    this.setHeaders(this.sessionLogin('token'));
    
    const formData: FormData = new FormData();
    formData.append('name', apk_name);
    formData.append('logo', logo);
    formData.append('apk', apk);
    formData.append('apk_id', apk_id);

    this.response = this.http.post(this.baseUrl + '/users/edit/apk', formData, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // dealer profile
  profilelist() {
    this.setHeaders(this.sessionLogin('token'));
    /*this.response = this.http.get(this.baseUrl + '/users/getinfo/' + this.sessionLogin('id') + '/dealer',
     {headers: { 'authorization': this.sessionLogin('token')} });*/
    this.response = this.http.get(this.baseUrl + '/users/getinfo', this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // sdealer profile
  sdealerprofilelist() {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/getinfo/' + this.sessionLogin('id') + '/sdealer', this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // connect devices for dealer dash.
  refreshlist(device_id) {
    this.setHeaders(this.sessionLogin('token'));    

    this.response = this.http.get(this.baseUrl + '/users/connect/' + device_id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }
  getDeviceApps(device_id){
    this.setHeaders(this.sessionLogin('token'));    

    this.response = this.http.get(this.baseUrl + '/users/get_apps/' + device_id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // for dealer reset password(admin dashboard)
  updateAdminPassDealerDetails(dealer) {
    this.setHeaders(this.sessionLogin('token'));    
    this.response = this.http.post(this.baseUrl + '/users/resetpwd', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  getProfiles( dealer_id=null,profile_id=null,device_id=null){
    // let is_admin =req.body.is_admin;\
    this.setHeaders(this.sessionLogin('token'));
    
    let payload = {
      dealer_id: dealer_id,
      profile_id: profile_id,
      device_id: device_id
    }
    this.response = this.http.post(this.baseUrl + '/users/get_profiles', payload, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // for dealer reset password(admin dashboard)
  updateAdminsabPassDealerDetails(sdealer) {
    this.setHeaders(this.sessionLogin('token'));

    this.response = this.http.post(this.baseUrl + '/users/resetpwd', sdealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // for dealer reset password(dealer dashboard)
  updatedealerPassDealerDetails(dealer) {
    this.setHeaders(this.sessionLogin('token'));

    this.response = this.http.post(this.baseUrl + '/users/resetpwd', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // for dealer (add devices)
  addDealerdevices(devices) {
    //  console.log(devices);
    this.setHeaders(this.sessionLogin('token'));
    // console.log(this.baseUrl);
    this.response = this.http.post(this.baseUrl + '/users/new/devices', this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // for admin(all dealers)
  getUserDealers() {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/dealers', this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // For admin(all sdealers)
  getUserSDealers() {
    this.setHeaders(this.sessionLogin('token'));
    console.log(this.baseUrl);
    this.response = this.http.get(this.baseUrl + '/users/sdealers', this.oHeaders);
    this.authtoken(this.response);
    console.log(this.response);
    return this.response;
  }

  // For dealers(all sdealers)
  getUserSubDealers(dealer_id) {
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.get(this.baseUrl + '/users/sdealers/' + dealer_id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // unlink (dealer-devices) dealer dash.
  unlinkUser(device_id) {
    // console.log(this.baseUrl);
    this.spinnerService.show();
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.post(this.baseUrl + '/users/unlink/' + device_id, '', this.oHeaders)
    .subscribe(response => {
      this.spinnerService.hide();
      this.authtoken(response);
      console.log(response);
      Swal({
       text: 'Device unlink successfully',
       type: 'success'
      }).then(okay => {
       location.reload(true);
     });
     return this.response;
     });
  }

  // unlink (dealer-cevices) admin dash.
  unlinkdealerUser(dealer_id) {
    this.spinnerService.show();
    // console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.delete(this.baseUrl + '/users/dealer/delete/' + dealer_id, this.oHeaders).subscribe(response => {
      this.spinnerService.hide();
      this.authtoken(response);
      this.response = response;
      console.log(response);
      Swal({
        text: this.response.msg,
        type: 'warning'
      }).then(okay => {
        location.reload(true);
      });
      return this.response;
    });
  }

  // unlink (dealer-cevices) admin dash.
  unlinkapk(apk_id) {
    this.spinnerService.show();
    // console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.post(this.baseUrl + '/users/apk/delete/', {apk_id: apk_id}, this.oHeaders ).subscribe(response => {
      this.spinnerService.hide();
      this.authtoken(response);
      this.response = response;
      console.log(response);
      Swal({
        text: this.response.msg,
        type: 'warning'
      }).then(okay => {
        location.reload(true);
      });
      return this.response;
    });
  }

  // suspend account
  suspendForm(device_id) {
    // console.log(device_id);
    this.setHeaders(this.sessionLogin('token'));
    console.log(this.baseUrl);
    this.response = this.http.post(this.baseUrl + '/users/suspend/' +  device_id, '', this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // suspend dealer account
  suspendsdealerForm(dealer_id) {
    //  console.log(dealer_id);
    this.setHeaders(this.sessionLogin('token'));
    console.log(this.baseUrl);
    this.response = this.http.post(this.baseUrl + '/users/dealer/suspend', {dealerId: dealer_id}, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // activate account
  activateForm(device_id) {
  // console.log(device_id);
    console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.post(this.baseUrl + '/users/activate/' +  device_id, '', this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // activate dealer account
  activatedealerForm(dealer_id) {
    // console.log(device_id);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.post(this.baseUrl + '/users/dealer/activate', {dealerId: dealer_id}, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  deleteUser(device_id) {
   // console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.delete(this.baseUrl + '/users/delete/' + device_id, this.oHeaders).subscribe(response => {
    //   console.log(response);
       this.authtoken(this.response);
       Swal({
        text: this.response.msg,
        type: 'warning'
       }).then(okay => {
        location.reload(true);
      });
      return this.response;
    });
  }

  deleteAdminUser(device_id) {
    this.spinnerService.show();
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.delete(this.baseUrl + '/users/delete/' + device_id, this.oHeaders).subscribe(response => {
      this.authtoken(this.response);
      this.spinnerService.hide();
      Swal({
        text: 'This device delete successfully',
        type: 'warning'
      }).then(okay => {
        //  location.reload(true);
        this.router.navigate(['/devices']);
      });
      //   return this.response;
    });
  }

  updateUserDetails(user) {
    // console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.put(this.baseUrl + '/users/edit/devices', user, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }


  addDealer(dealer) {
    console.log(dealer);
    console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));

    this.response = this.http.post(this.baseUrl + '/users/add/dealer', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  addSDealer(dealer) {

    this.setHeaders(this.sessionLogin('token'));
   // dealer.dealerId = this.sessionLogin('id');

    this.response = this.http.post(this.baseUrl + '/users/add/sdealer', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }
  addSDealerbydealer(dealer) {
    this.setHeaders(this.sessionLogin('token'));

    dealer.dealerId = this.sessionLogin('id');
    this.response = this.http.post(this.baseUrl + '/users/add/sdealer', dealer, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }


  // Adnin login
  adminLogin(admin): Observable<any> {
    console.log(admin);
    this.setHeaders(this.sessionLogin('token'));
    return this.http.post(this.baseUrl + '/users/Login', admin );
  }

  addDevice(devices) {
    console.log(devices);
    console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));
    this.response = this.http.post(this.baseUrl + '/users/new/devices', devices,  this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  // for logout
  authSignOut() {
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('id');
    window.localStorage.removeItem('type');
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('firstName');
    window.localStorage.removeItem('lastName');
    window.localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // for dealerLogout
  authdealerSignOut() {
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
    this.router.navigate(['/dealer/login']);
  }
  InvalidPage() {

  }
  // for SdealerLogout
  authSdealerSignOut() {
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
    this.router.navigate(['/sdealer/login']);
  }

  // for authentication token
  authtoken(response) {
    if (response.success === false && response.message === 'Failed to authenticate token.') {
      Swal({
        text: response.message,
        type: 'error',
        customClass: 'swal-height'
      }).then(okay => {
        this.router.navigate(['/login']);
      });
    }

  }

  // Undo For Dealer and Sub dealer
  undoUser(id) {
    this.token = this.sessionLogin('token');
    const header = new HttpHeaders();
    header.append('authorization', this.sessionLogin('token'));
    this.response = this.http.post(this.baseUrl + '/users/dealer/undo', {dealerId: id}, this.oHeaders );
    this.authtoken(this.response);
    return this.response;
  }

  errorHandler(error: Response) {
    return error;
  }

  // Dropdown Api
  getAdminSelectedItems(headers) {
    // console.log(this.baseUrl);
    // this.token = this.sessionLogin('token');
    // const header = new HttpHeaders();
    //
    // header.append('authorization', this.sessionLogin('token'));
    // this.response = this.http.get(this.baseUrl + '/users/admin/gtdropdown', {headers: { 'authorization': this.sessionLogin('token')} });
    // this.authtoken(this.response);
    // return this.response;

    console.log(this.baseUrl);
    const dealer_id = this.sessionLogin('id');
    // tslint:disable-next-line:max-line-length
    this.response = this.http.get(this.baseUrl + '/users/dealer/gtdropdown/' + dealer_id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  postAdminSelectedItems(selectedItems) {
    //  const items = JSON.stringify(selectedItems);
    //  console.log('selectedItems:- ' + items);
    //  console.log(this.baseUrl);
    //  this.token = this.sessionLogin('token');
    //  const header = new HttpHeaders();
    //  header.append('authorization', this.sessionLogin('token'));
    //  this.http.post(this.baseUrl + '/users/admin/dropdown', {selected_items: items}, {
    //    headers: { 'authorization': this.sessionLogin('token')}
    //  }).subscribe(tradeBotInfo => {
    // });
    const items = JSON.stringify(selectedItems);
    console.log(this.baseUrl);
    this.setHeaders(this.sessionLogin('token'));
    
    const dealer_id = this.sessionLogin('id');

    this.http.post(this.baseUrl + '/users/dealer/dropdown', {dealer_id: dealer_id, selected_items: items}, this.oHeaders).subscribe(tradeBotInfo => {
      console.log(tradeBotInfo);
    });
  }

  // Dealer and sdealers items apis
  getDealerSelectedItems(headers) {
    console.log(this.baseUrl);
    const dealer_id = this.sessionLogin('id');
    // tslint:disable-next-line:max-line-length
    this.response = this.http.get(this.baseUrl + '/users/dealer/gtdropdown/' + dealer_id, this.oHeaders);
    this.authtoken(this.response);
    return this.response;
  }

  postDealerSelectedItems(selectedItems) {
    const items = JSON.stringify(selectedItems);
    this.token = this.sessionLogin('token');
    const header = new HttpHeaders();
    const dealer_id = this.sessionLogin('id');

    header.append('authorization', this.sessionLogin('token'));
    this.http.post(this.baseUrl + '/users/dealer/dropdown', {dealer_id: dealer_id, selected_items: items}, this.oHeaders ).subscribe(tradeBotInfo => {
      console.log(tradeBotInfo);
    });
  }

  applySettings(device_setting, device_id,type="history",name=null,dealer_id=0){

    device_setting.app_list.forEach((elem)=>{
      elem.packageName = elem.uniqueName.replace(elem.label,'');
      if(elem.guest){
        elem.guest=true;
      }else{
        elem.guest = false;
      }
      if(elem.encrypted){
        elem.encrypted=true;
      }else{
        elem.encrypted = false;
      }
      if(elem.enable){
        elem.enable=true;
      }else{
        elem.enable = false;
      }
      delete elem.device_id;
      delete elem.isChanged;
    });
    this.setHeaders(this.sessionLogin('token'));    
    this.http.post(this.baseUrl + '/users/apply_settings/' + device_id, {
      device_setting,
      type: type,
      name: name,
      dealer_id: dealer_id
    }, this.oHeaders).subscribe(resp => {

    });
  }

  deleteProfile(profileId){
    this.setHeaders(this.sessionLogin('token'));
    this.http.delete(this.baseUrl + '/users/delete_profile/' + profileId, this.oHeaders).subscribe(resp => {

    });
  }
}
