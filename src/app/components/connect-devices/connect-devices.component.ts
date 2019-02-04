import { Component, OnInit, Inject, } from '@angular/core';
import { RestService } from '../../services/rest.service';
// import { PushNotificationService } from '../../push-notification.service';
import Swal from 'sweetalert2';
// import { NgForm } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Common } from '../../entity/common';
// import * as io from "socket.io-client";

const today = new Date();
// tslint:disable-next-line:max-line-length
const timest = (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes());
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timest;

@Component({
  selector: 'app-connect-devices',
  templateUrl: './connect-devices.component.html',
  styleUrls: ['./connect-devices.component.css']
})
export class ConnectAdminDevicesComponent implements OnInit {
  path: any;
  private resp: any = null;
  device_data = {
    account_status: '',
    client_id: '',
    device_id: '',
    email: '',
    expiry_date: '',
    imei: '',
    ip_address: '',
    mac_address: '',
    model: '',
    name: '',
    s_dealer_name: '',
    serial_number: '',
    simno: '',
    start_date: '',
    status: '',
    is_sync: 0
  };
  isAdmin = false;
  userType: string;
  pageName: any = "main_menu";
  
  conf_admin_pwd: string;
  conf_guest_pwd: string;
  conf_enc_pwd: string;
  passwords = {
    admin_password: null,
    guest_password: null,
    encrypted_password: null
  };
  
  appList = [];
  stackedApps = [];
  redoStackedApps = [];

  // device_setting :any;
  // changedSettings = {
  //   guest: false,
  //   encrypted: false,
  //   enable: false
  // };
  
  deviceControls = {
    call_status: false,
    bluetooth_status: false,
    wifi_status: false,
    screenshot_status: false,
    hotspot_status: false
  };

  stackedControls = [];
  redoStackedControls = [];
  
  // after apply
  changedApps = [];
  changedControls = {
    call_status: false,
    bluetooth_status: false,
    wifi_status: false,
    screenshot_status: false,
    hotspot_status: false
  };
  baseUrl = this.common.baseurl;
  private sockets;

  profile_type = "profile";

  profiles = [];
  policies = [];
  mainProfiles = [];
  deviceHistories = [];

  dealer_id: number;
  connected_dealer: number;
  profileName: string;
  policyName: string;

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private spinnerService: Ng4LoadingSpinnerService,
    private common: Common
    // private sockets:PushNotificationService
  ) {
    this.dealer_id = Number(window.localStorage.getItem("id"));
    if (window.localStorage.getItem("type").replace(/"/g, "") == "admin") this.isAdmin = true;
    this.userType = window.localStorage.getItem("type").replace(/"/g, "");
    this.connected_dealer = Number(window.localStorage.getItem("connected_dealer"));

  }

  ngOnInit() {
    this.path = this.router.url.split('/');
    let device_id = this.path[2];

    this.spinnerService.show();

    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.restService.authtoken(response);
    });

    this.restService.getDeviceApps(device_id).subscribe((response) => {
      // apps
      this.appList = response.app_list;
      this.stackedApps.push(this.copyObject(response.app_list));
      if (response.controls instanceof Array){
        this.deviceControls = {
          call_status: false,
          bluetooth_status: false,
          wifi_status: false,
          screenshot_status:false,
          hotspot_status:false
        };
      }else{
        
        this.deviceControls = response.controls;
        console.log(response.controls);
        
      }
      this.stackedControls.push(this.copyObject(this.deviceControls));
      console.log(this.stackedControls);
      
      this.restService.authtoken(response);
      this.allChecked();
    });
    
    this.getProfiles();
    this.getHistories(device_id);
    this.allChecked();

    let token = window.localStorage.getItem('token');

    let makeToken = "token=" + token + "&device_id=" + device_id + "&isWeb=true";
    console.log("token query: " + makeToken);

    // this.sockets = io.connect(this.baseUrl.toString(), {
    //   query: makeToken,
    //   reconnectionDelay: 1000,
    //   reconnection: true,
    //   forceNew: true
    // });
    // console.log("get_sync_status_"+ device_id);
    // this.sockets.on('get_sync_status_' + device_id, (data) => {
    //   this.spinnerService.show();
    //   this.refresh(device_id);
    //   this.spinnerService.hide();
    // });

  }

  // refresh button
  refresh(device_id, check_button) {
    console.log("refresh click");
    device_id = this.route.snapshot.paramMap.get('device_id');
    // this.spinnerService.show();

    this.restService.refreshlist(device_id).subscribe((response) => {
      this.device_data = response;
      this.restService.authtoken(response);
    });
    console.log(this.device_data);
    
    this.getProfiles();
    this.getHistories(device_id);

    // change action button
    this.changeActionButton('.clear_all_action', true);
    this.changeActionButton('.apply_action', true);
    this.changeActionButton('.undo_action', true);
    this.changeActionButton('.redo_action', true);

    this.conf_admin_pwd = null;
    this.conf_guest_pwd = null;
    this.conf_enc_pwd = null;
    this.passwords.admin_password = null;
    this.passwords.guest_password = null;
    this.passwords.encrypted_password = null;
    // this.spinnerService.hide();

    if (check_button === "btn_ok") {
      console.log("apps are not refreshed")
      return;
    }
    this.emptyStack();
    this.pageName = "main_menu";
    this.restService.getDeviceApps(device_id).subscribe((response) => {
      // apps
      this.appList = response.app_list;
      this.stackedApps.push(this.copyObject(response.app_list));
      if (response.controls instanceof Array) {
        this.deviceControls = {
          call_status: false,
          bluetooth_status: false,
          wifi_status: false,
          screenshot_status: false,
          hotspot_status: false
        };

      } else {
        this.deviceControls = this.copyObject(response.controls);
      }
      this.stackedControls.push(this.copyObject(this.deviceControls));
      console.log(this.stackedControls);
      this.restService.authtoken(response);
      this.allChecked();
    });

  }

  // loadData(){
  //   this.restService.refreshlist(device_id).subscribe((response) => {
  //     this.device_data = response;
  //     this.restService.authtoken(response);
  //   });

  //   this.restService.getDeviceApps(device_id).subscribe((response) => {
  //     this.appList = response;
  //     this.stackedApps.push(this.copyObject(response));
  //     this.restService.authtoken(response);
  //     this.allChecked();
  //   });

  //   this.getProfiles();
  //   this.getHistories(device_id);
  // }
  ngAfterInit() {

    this.allChecked();
  }
  private allChecked() {
    $('.on_guest').prop('checked', this.checkedAll('guest'));
    $('.on_encrypted').prop('checked', this.checkedAll('encrypted'));
    $('.enable_all').prop('checked', this.checkedAll('enable'));
  }

  getProfiles() {
    this.profiles = [];
    this.policies = [];

    if (this.isAdmin) {
      // all policies, all profiles
      this.restService.getProfiles().subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == "profile") {
            this.profiles.push(elem);
          } else if (elem.type = "policy") {
            this.policies.push(elem);
          }
        });
        this.mainProfiles = response.profiles;

        this.restService.authtoken(response);
      });
    } else if (this.userType == "dealer") {
      // all policies, his profiles
      this.restService.getProfiles(this.dealer_id).subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == "profile") {
            this.profiles.push(elem);
          } else if (elem.type = "policy") {
            this.policies.push(elem);
          }
        });
        this.mainProfiles = response.profiles;

        this.restService.authtoken(response);
      });
    } else if (this.userType == "sdealer") {

      this.restService.getProfiles(this.connected_dealer).subscribe((response) => {
        response.profiles.forEach(elem => {
          if (elem.type == "profile") {
            this.profiles.push(elem);
          } else if (elem.type = "policy") {
            this.policies.push(elem);
          }
        });
        this.mainProfiles = response.profiles;

        this.restService.authtoken(response);

      });
    }
  }

  getHistories(device_id) {
    console.log("histories");
    console.log(device_id);
    this.restService.getProfiles(null, null, device_id).subscribe((response) => {
      console.log(response.profiles);
      this.deviceHistories = response.profiles;

      this.restService.authtoken(response);
    });

  }
  ngAfterViewInit() {
    console.log("ngAfterViewInit");

  }


  changePage(pageName, event) {
    this.pageName = pageName;
  }

  clearDropDown(className) {

    if (className == ".load_history") {
      $('.load_profile').val('');
      $('.load_policy').val('');
    } else if (className == ".load_profile") {
      $('.load_policy').val('');
      $('.load_history').val('');
    } else {
      $('.load_history').val('');
      $('.load_profile').val('');
    }
  }

  unlinkUser(device_id) {
    Swal({
      text: 'Are you sure, you want to unlink the device?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((result) => {
      if (result.value == true) {
        this.spinnerService.show();
        this.restService.unlinkUser(device_id);
        this.spinnerService.hide();
        this.router.navigate(['/devices']);
      }
    });
  }

  saveProfile(event, profile_type) {
    let profileName;

    Swal.queue([{
      title: profile_type.charAt(0).toUpperCase() + profile_type.slice(1) + ' Name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        required: "required"
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: (pName) => {
        if (pName != null && pName != '') {
          profileName = pName;
          if (this.stackedApps.length > 1 || this.passwords.admin_password || this.passwords.guest_password || this.passwords.encrypted_password) {
            // let app_list = this.getChangedApps(this.stackedApps[this.stackedApps.length - 1]);
            let app_list = this.stackedApps[this.stackedApps.length - 1];
            console.log("app_list");
            console.log(app_list);
            
            let controls = this.stackedControls[this.stackedControls.length - 1];
            console.log("app_controls");
            console.log(controls);

            let device_setting = {
              app_list: app_list,
              passwords: this.passwords,
              controls: controls
            };

            this.restService.applySettings(device_setting, this.device_data.device_id, profile_type, profileName, this.dealer_id);
            this.clearStack();
            Swal.insertQueueStep({
              text: 'Settings are successfully saved as ' + profile_type,
              showCancelButton: false,
              // cancelButtonText: 'No',
              // confirmButtonText: 'Yes',
              type: 'success'
            });
          } else {
            Swal.insertQueueStep({
              text: 'please make a change before save settings!',
              showCancelButton: false,
              // cancelButtonText: 'No',
              // confirmButtonText: 'Yes',
              type: 'warning'
            });
          }
        } else {
          Swal.insertQueueStep({
            text: 'A name must be provided',
            showCancelButton: false,
            // cancelButtonText: 'No',
            // confirmButtonText: 'Yes',
            type: 'warning'
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }]);

  }

  suspendForm(device_id) {
    Swal({
      text: 'Are you sure, you want to suspend the device?',
      showCancelButton: true,
      useRejections: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'warning'
    }).then((okay) => {
      if (okay) {
        // location.reload(true);
        this.spinnerService.show();
        this.restService.suspendForm(device_id).subscribe((response) => {
          //   this.spinnerService.hide();
          this.restService.authtoken(response);
          this.resp = response;
          if (this.resp.status === true) {
            Swal({
              text: this.resp.msg,
              type: 'success',
              customClass: 'swal-height'
            }).then(result => {
              if (result.value) {
                this.router.navigate(['/devices']);
              }
            });
          } else {
            if (this.resp.status === false) {
              Swal({
                text: this.resp.msg,
                type: 'warning',
                customClass: 'swal-height'
              }).then(result => {
                if (result.value) {
                  location.reload(false);
                }
              });
            }
          }
        });
        this.spinnerService.hide();
      }
    });
  }

  loadProfile(event) {
    Swal({
      text: 'Do you really want to override settings?',
      showCancelButton: true,
      useRejections: false,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'info'
    }).then((res) => {
      console.log(res);
      if (res.dismiss) {
        this.clearDropDown('.load_history');
        this.clearDropDown('.load_profile');
        this.clearDropDown('.load_policy');
        return;
      }
      var className = event.target.attributes.class.nodeValue;
      this.clearDropDown('.' + className);
      let profileId = event.target.value;
      console.log(this.mainProfiles);

      this.mainProfiles.forEach(elem => {
        if (elem.id == profileId) {
          this.appList = JSON.parse(elem.app_list);
          this.stackedApps.push(this.copyObject(JSON.parse(elem.app_list)));
          this.changedApps = this.stackedApps[this.stackedApps.length - 1];
          this.changedApps.map((elem) => {
            elem.isChanged = 1;
          });
          console.log(this.changedApps);
          this.changeActionButton('.apply_action', false);
          this.changeActionButton('.undo_action', false);
          this.changeActionButton('.clear_all_action', false);
          $('.on_guest').prop('checked', this.checkedAll('guest'));
          $('.on_encrypted').prop('checked', this.checkedAll('encrypted'));
          $('.enable_all').prop('checked', this.checkedAll('enable'));
        }
      });
    });

  }

  loadHistory(historyId,event) {
    Swal({
      text: 'Do you really want to override settings?',
      showCancelButton: true,
      useRejections: false,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'info'
    }).then((res) => {
      console.log(res);
      if (res.dismiss) {
        this.clearDropDown('.load_history');
        this.clearDropDown('.load_profile');
        this.clearDropDown('.load_policy');
        return;
      }
      this.pageName = "apps_list";
      this.clearDropDown('.load_history');

      let profileId = historyId;
      console.log(this.mainProfiles);

      this.deviceHistories.forEach(elem => {
        if (elem.id == profileId) {
          this.appList = JSON.parse(elem.app_list);
          this.stackedApps.push(this.copyObject(JSON.parse(elem.app_list)));
          this.changedApps = this.stackedApps[this.stackedApps.length - 1];
          this.changedApps.map((elem) => {
            elem.isChanged = 1;
          });
          console.log(this.changedApps);
          this.changeActionButton('.apply_action', false);
          this.changeActionButton('.undo_action', false);
          this.changeActionButton('.clear_all_action', false);
          $('.on_guest').prop('checked', this.checkedAll('guest'));
          $('.on_encrypted').prop('checked', this.checkedAll('encrypted'));
          $('.enable_all').prop('checked', this.checkedAll('enable'));
        }
      });
    });

  }

  collapse(historyId,e){
   console.log(historyId);
    var clsName=e.target.attributes.class.nodeValue;
    console.log(clsName);
    
    var elem=$(e.target);
    console.log(elem);

    let history : any;
    this.deviceHistories.forEach( ( el ) =>{
      if(el.id == historyId){
        console.log(el);
        history = el;
        return;
      }
    });
    let apps = JSON.parse(history.app_list);
    let controls = JSON.parse(history.controls);

    var headString = '<div class="row">'+
                        '<div class="col-sm-12">'+
                          '<table id="classTable" class="table table-striped table-bordered responsive" cellspacing="0">'+
                            '<thead>'+
                              '<th scope="col text-center" style="text-align:center;">Icon</th>'+
                              '<th scope="col text-center" style="text-align:center;">App Name</th>'+
                              '<th scope="col text-center" style="text-align:center;">Guest</th>'+
                              '<th scope="col text-center" style="text-align:center;">Encrypted</th>'+
                              '<th scope="col text-center" style="text-align:center;">Enable</th>'+
                            '</thead>'+
                            '<tbody>';
      var appsString:string='';
      apps.forEach((app)=>{
        appsString +='<tr>' +
                        '<td> <img src="' + this.baseUrl + '/users/getFile/' + app.icon +'" alt="" style="width: 30px;height: 30px;" /></td>'+
                        '<td data-table-header="">'+ app.label +'</td>'+
                        '<td data-table-header="">'+ (app.guest == 1 ? 'On' : 'Off') +'</td>'+
                        '<td data-table-header="" >'+ (app.encrypted == 1 ? 'On' : 'Off') +'</td>'+
                        '<td data-table-header="" >'+ (app.enable == 1 ? 'On' : 'Off') +'</td>'+
                      '</tr>';
      });
      
      var controlsString:string;
      // controls.forEach((control)=>{
      //   // controlsString += '<tr'+
      //   //                     '<td><img src="{{baseUrl}}/users/getFile/icon_Settings.png" style="width: 30px;height: 30px;"/></td>'+
      //   //                     '<td>Call</td>'+
      //   //                     '<td></td>'+
      //   //                     '<td></td>'+
      //   //                     '<td [className]="changedControls.call_status==true ?\'green\':\'red\'">{{(changedControls.call_status==true)?\'On\':\'Off\'}}</td>'+
      //   //                     '</tr>'+
      // });
                      
      var footString=     '</tbody>'+
                        '</table>'+
                        '</div>'+
                    '</div>';
    if(clsName == "fa fa-plus"){
      console.log("expanding data");
      elem.attr('class','fa fa-times');
      elem.parent().attr('class','unexpand rounded');

      $(document).find('.detailed_row_' + historyId).children('td').html(headString + appsString + footString);
      $(document).find('.detailed_row_' + historyId).show();
    }else if(clsName == "expand rounded"){
      elem.attr('class','unexpand rounded');
      elem.children().attr('class', 'fa fa-times');

      $(document).find('.detailed_row_'+ historyId).children('td').html(headString + appsString + footString);
      $(document).find('.detailed_row_'+ historyId).show();
    }else if(clsName == "unexpand rounded"){
      
      var tr=elem.parent('.btnFull').parent();
      $(document).find('.detailed_row_'+historyId).hide();

      elem.attr('class','expand rounded');
      elem.children().attr('class', 'fa fa-plus');
    }else if(clsName == "fa fa-times"){
      var tr=elem.parent('.btnFull').parent();
      $(document).find('.detailed_row_' + historyId).hide();
      elem.attr('class','fa fa-plus');
      elem.parent().attr('class','expand rounded');
    }

  }
  ngOnChanges() {
    this.allChecked();
  }

  changeActionButton(className, val = false) {
    if (val) {
      $(className).attr('disabled', 'disabled');
      // $(className).prop('disabled', val);

    } else {
      $(className).removeAttr('disabled');
      $(className).prop('disabled', val);
    }
  }

  checkApps(event, app = null) {
    // console.log("check apps");
    // console.log(this.appList);

    var name = event.target.name;
    var value = event.target.value;
    var checked = event.target.checked;
    var className = event.target.attributes.class.nodeValue;
    var id = event.target.attributes.id;
    if (id != undefined) {
      id = id.nodeValue;
    }

    if (name == "check_all") {

      if (checked == true) {
        if (value == "enable_all") {
          $('.enabled').prop('checked', true);
          this.setSelectAll('enable', 1);
        } else if (value == "on_encrypted") {
          $('.encrypted').prop('checked', true);
          this.setSelectAll('encrypted', 1);

        } else if (value == "on_guest") {
          $('.guest').prop('checked', true);
          this.setSelectAll('guest', 1);

        }
      } else {
        if (value == "enable_all") {
          $('.enabled').prop('checked', false);
          this.setSelectAll('enable', 0);

        } else if (value == "on_encrypted") {
          $('.encrypted').prop('checked', false);
          this.setSelectAll('encrypted', 0);

        } else if (value == "on_guest") {
          $('.guest').prop('checked', false);
          this.setSelectAll('guest', 0);

        }
      }
      this.appList.forEach((elem) => {
        if (elem.isChanged == undefined) {
          elem.isChanged = 1;
        }
      });

      this.stackedApps.push(this.copyObject(this.appList));
      console.log("on select/unselect all");
    } else if (id == "apps") {
      if (app != null) {
        let appIndex = this.getAppIndex(this.appList, app.uniqueName);

        if (this.appList[appIndex].isChanged == undefined) {
          this.appList[appIndex].isChanged = 1;
        }

        if (className == "guest" && checked == false) {
          $('.on_guest').prop('checked', false);
          this.appList[appIndex].guest = 0;
        } else if (className == "guest" && checked == true) {
          this.appList[appIndex].guest = 1;
          $('.on_guest').prop('checked', this.checkedAll('guest'));
        }

        if (className == "encrypted" && checked == false) {
          $('.on_encrypted').prop('checked', false);
          this.appList[appIndex].encrypted = 0;
        } else if (className == "encrypted" && checked == true) {
          this.appList[appIndex].encrypted = 1;
          $('.on_encrypted').prop('checked', this.checkedAll('encrypted'));
        }

        if (className == "enabled" && checked == false) {
          $('.enable_all').prop('checked', false);
          this.appList[appIndex].enable = 0;
        } else if (className == "enabled" && checked == true) {
          this.appList[appIndex].enable = 1;
          $('.enable_all').prop('checked', this.checkedAll('enable'));

        }
        // console.log(this.appList);

        this.stackedApps.push(JSON.parse(JSON.stringify(this.appList)));
        // this.appStackTop++;

        console.log(this.stackedApps);
      } else {
        if (className == "guest" && checked == false) {
          $('.on_guest').prop('checked', false);
        }

        if (className == "encrypted" && checked == false) {
          $('.on_encrypted').prop('checked', false);
        }

        if (className == "enabled" && checked == false) {
          $('.enable_all').prop('checked', false);
        }
      }
    }
    this.changeActionButton('.apply_action', false);
    this.changeActionButton('.undo_action', false);
    this.changeActionButton('.clear_all_action', false);

  }

  checkControls(event){
    var name = event.target.name;
    var value = event.target.value;
    var checked = event.target.checked;
    var className = event.target.attributes.class.nodeValue;
    var id = event.target.attributes.id;
    console.log(name);
    console.log(value);
    console.log(checked);
    console.log(className);
    console.log(id);
    this.stackedControls.push(this.copyObject(this.deviceControls));
    console.log(this.stackedControls);
    console.log("length of controls: "+this.stackedControls.length);
    this.changeActionButton('.apply_action', false);
    this.changeActionButton('.undo_action', false);
    this.changeActionButton('.clear_all_action', false);
  }
  checkedAll(key) {
    console.log(key);
    var i = 0;
    this.appList.forEach((elem) => {
      if (elem[key] == 1 || elem[key] == true) {
        i = i + 1;
      }
    });
    console.log("i:" + i);
    console.log("length:" + this.appList.length);
    if (this.appList.length == i) {
      return true;
    } else {
      return false;
    }
  }

  setSelectAll(key, value) {
    this.appList.forEach((elem) => {
      elem[key] = value
    });
  }

  applySettings(event) {
    console.log("apply settings");
    console.log(this.passwords);
    console.log("stack apps");
    console.log(this.stackedApps);
    if (this.stackedApps.length > 1 || this.passwords.admin_password || this.passwords.guest_password || this.passwords.encrypted_password || this.stackedControls.length > 1) {
      // let app_list = this.getChangedApps(this.stackedApps[this.stackedApps.length -1]);
      let app_list = this.stackedApps[this.stackedApps.length - 1];
      console.log("app_list");
      console.log(app_list);
      let controls = this.stackedControls[this.stackedControls.length -1];

      let device_setting = {
        app_list: app_list,
        passwords: this.passwords,
        controls: controls
      };
      console.log(device_setting);
      this.restService.applySettings(device_setting, this.device_data.device_id);
      this.clearStack();

      Swal({
        text: 'Settings are successfully applied',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'success'
      }).then(() => {
        this.refresh(this.device_data.device_id, "btn_ok");
      });
    } else {
      Swal({
        text: 'please make a change before apply!',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'info'
      }).then(() => {
      });
    }
  }

  clearStack() {
    this.stackedApps = [];
    this.redoStackedApps = [];
    this.stackedControls = [];
    this.redoStackedControls = [];
    this.stackedApps.push(this.copyObject(this.appList));
    this.stackedControls.push(this.copyObject(this.deviceControls));
    console.log("clearstack()");
    console.log(this.stackedApps);
  }
  emptyStack() {
    this.stackedApps = [];
    this.redoStackedApps = [];
  }
  getChangedApps(apps) {
    let retApps = [];

    for (var i = 0; i < apps.length; i++) {
      if (apps[i].isChanged != undefined) {
        retApps.push(JSON.parse(JSON.stringify(apps[i])));
      }
    }
    return retApps;
  }
  getAppsChanged(e) {
    console.log(this.stackedApps);
    if(this.stackedApps.length > 1){
      alert("hello");  
      this.changedApps = this.getChangedApps(this.stackedApps[this.stackedApps.length - 1]);
    }
    if(this.stackedControls.length >1){
      this.changedControls = this.stackedControls[this.stackedControls.length -1];
    }
  }

  undoSettings(event) {


    if (this.stackedApps.length > 1 || this.stackedControls.length > 1) {
      
      if (this.stackedApps.length > 1 && this.pageName =="apps_list"){
        console.log("Apps Stack Length: " + this.stackedApps.length);
        console.log(this.stackedApps);
        let apps = this.stackedApps[this.stackedApps.length - 1];
        this.stackedApps.pop();

        console.log("stack length: " + this.stackedApps.length);
        // this.appList= this.copyObject(this.stackedApps[this.stackedApps.length -1]);
        this.copytoApps(this.stackedApps[this.stackedApps.length - 1]);
        this.redoStackedApps.push(apps);
        this.changeActionButton('.redo_action', false);
      }
      
      if (this.stackedControls.length > 1 && this.pageName =="setting_list"){
        console.log("Setting Stack Length: " + this.stackedControls.length);
        console.log(this.stackedControls);

        let controls = this.stackedControls[this.stackedControls.length - 1];
        console.log(controls);

        this.stackedControls.pop();
        console.log("stack length: " + this.stackedControls.length);
        this.deviceControls = this.copyObject(this.stackedControls[this.stackedControls.length - 1]);
        this.redoStackedControls.push(controls);
        this.changeActionButton('.redo_action', false);
      }

      if (this.stackedApps.length == 1 && this.stackedControls.length == 1) {
        this.changeActionButton('.undo_action', true);
        this.changeActionButton('.apply_action', true);
      }
      


    } else {
      this.changeActionButton('.undo_action', true);

      Swal({
        text: 'there is no setting to undo',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'info'
      }).then(() => {
      });
    }

  }
  copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  copytoApps(obj) {
    for (let i = 0; i < obj.length; i++) {
      this.appList[i].guest = obj[i].guest;
      this.appList[i].encrypted = obj[i].encrypted;
      this.appList[i].enable = obj[i].enable;
    }
  }
  redoSettings(event) {
    if (this.redoStackedApps.length > 0 || this.redoStackedControls.length >0) {
      if(this.redoStackedApps.length > 0 && this.pageName=="apps_list"){
        let apps = this.redoStackedApps[this.redoStackedApps.length - 1];
        this.redoStackedApps.pop();
        this.stackedApps.push(apps);
        this.copytoApps(this.stackedApps[this.stackedApps.length - 1]);
        this.changeActionButton('.undo_action', false);
        this.changeActionButton('.apply_action', false);
      }

      if(this.redoStackedControls.length > 0 && this.pageName == "setting_list"){
        let controls = this.redoStackedControls[this.redoStackedControls.length - 1];
        this.redoStackedControls.pop();
        this.stackedControls.push(controls);
        this.deviceControls = this.copyObject(this.stackedControls[this.stackedControls.length -1]);
        this.changeActionButton('.undo_action', false);
        this.changeActionButton('.apply_action', false);
      }

      if (this.redoStackedApps.length == 0 && this.redoStackedControls.length ==0) {
        this.changeActionButton('.redo_action', true);
      }
      this.changeActionButton('.undo_action', false);
      this.changeActionButton('.apply_action', false);
      
    } else {
      this.changeActionButton('.redo_action', true);

      Swal({
        text: 'there is no setting to redo',
        showCancelButton: false,
        useRejections: false,
        // cancelButtonText: 'No',
        // confirmButtonText: 'Yes',
        type: 'info'
      }).then(() => {
      });
    }

  }

  clearAll(event) {
    Swal({
      text: 'All changes are undone',
      showCancelButton: false,
      useRejections: false,
      // cancelButtonText: 'No',
      // confirmButtonText: 'Yes',
      type: 'success'
    }).then(() => {
    });
    this.refresh(this.device_data.device_id, "ok");
  }
  resetPassword(event, value) {
    var className = event.target.attributes.class.nodeValue.split(' ');
    className = className[className.length - 1];

    if (className == "confirm_encrypted") {
      if (this.passwords.encrypted_password == value) {
        this.toggleClass('.pwd_confirmed');
        this.changeActionButton('.apply_action');
        this.changeActionButton('.clear_all_action');
      } else {
        this.toggleClass('.not_matched');
      }
    } else if (className == "confirm_guest") {
      if (this.passwords.guest_password == value) {
        this.toggleClass('.pwd_confirmed');
        this.changeActionButton('.apply_action');
        this.changeActionButton('.clear_all_action');
      } else {
        this.toggleClass('.not_matched');
      }
    } else if (className == "confirm_admin") {
      if (this.passwords.admin_password == value) {
        this.toggleClass('.pwd_confirmed');
        this.changeActionButton('.apply_action');
        this.changeActionButton('.clear_all_action');
      } else {
        this.toggleClass('.not_matched');
      }
    }

  }
  toggleClass(className) {
    console.log(className);
    $(className).fadeIn('slow', function () {
      $(className).delay(1000).fadeOut();
    });
  }
  getAppIndex(apps, value) {
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].uniqueName === value) {
        return i;
      }
    }
  }

  searchApps(apps, key, value) {
    for (var i = 0; i < apps.length; i++) {
      if (apps[i][key] === value) {
        return apps[i];
      }
    }
  }

  // activate admin-device
  activateForm(device_id) {
    // console.log(device_id);
    Swal({
      text: 'Are you sure, you want to activate the device?',
      showCancelButton: true,
      useRejections: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      type: 'info'
    }).then((okay) => {
      if (okay) {
        this.spinnerService.show();
        this.restService.activateForm(device_id).subscribe((response) => {
          // this.spinnerService.hide();
          this.restService.authtoken(response);
          this.resp = response;
          if (this.resp.status === true) {
            this.spinnerService.hide();
            Swal({
              text: this.resp.msg,
              type: 'success',
              customClass: 'swal-height'
            }).then(result => {
              if (result.value) {
                location.reload(true);
              }
            });
          } else {
            if (this.resp.status === false) {
              this.spinnerService.hide();
              Swal({
                text: this.resp.msg,
                type: 'warning',
                customClass: 'swal-height'
              }).then(result => {
                if (result.value) {
                  location.reload(false);
                }
              });
            }
          }
          // this.spinnerService.hide();
        });
      }
    });
  }
  updateAdmin() {
    console.log(this.device_data);
    if (this.device_data.email === '' || this.device_data.name === '' || this.device_data.email === 'null' || this.device_data.name === 'null' || this.device_data.expiry_date === '' || this.device_data.expiry_date === 'null') {
      Swal({
        text: 'Please provide Name, Email and Expiry Date ',
        type: 'error',
        customClass: 'swal-height'
      }).then(okay => {
        return;
      });
    } else {
      // console.log(this.data);
      const extdate = new Date(this.device_data.expiry_date);
      // tslint:disable-next-line:max-line-length
      this.device_data.expiry_date = extdate.getFullYear() + '-' + this.getdate(extdate.getMonth() + 1) + '-' + this.getdate(extdate.getDate()) + ' ' + timest;
      console.log(this.device_data);
      if (this.device_data.expiry_date.trim() === null || this.device_data.expiry_date.trim() === ''
        || this.device_data.expiry_date.trim() === 'NaN-NaN-NaN Invalid' || this.device_data.expiry_date.split(' ')[0] === '1970-1-1') {
        console.log(this.device_data.expiry_date);
        this.device_data.expiry_date = '';
      }
      console.log(this.device_data.expiry_date);
      if (this.device_data.expiry_date.includes('NaN-NaN-NaN')) {
        this.device_data.expiry_date = '';
        console.log(this.device_data.expiry_date);
      }
      // this.device_data.s_dealer = '';
      // this.spinnerService.show();
      this.device_data.name = this.capitalize(this.device_data.name);
      this.restService.updateAdminDetails(this.device_data).subscribe((response) => {
        this.restService.authtoken(response);
        this.resp = response;
        if (this.resp.status === true) {
          Swal({
            text: 'You have successfully Update details',
            type: 'success',
            customClass: 'swal-height'
          }).then(okay => {
            if (okay) {
              location.reload(true);
            }
          });
        }
      });
      $('input.ng-invalid, select.ng-invalid, textarea.ng-invalid,checkbox.ng-invalid, file.ng-invalid').addClass('ng-touched');
    }
  }
  // update password
  updatePassDealer() {
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // Date format
  getdate(dd) {
    if (dd < 10) {
      dd = '0' + dd;
    } else {
      dd = dd;
    }
    return dd;
  }
  onLogout() {
    // this.sockets.disconnect();
    this.restService.authSignOut();
  }

  ngOnDestroy() {
    // this.sockets.disconnect();
  }
}
