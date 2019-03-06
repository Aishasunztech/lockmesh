import axios from 'axios';
import { BASE_URL } from '../../constants/Application';

const RestService = {
    // Login
    login: (user) => {
        // console.log("login rest service");
        // console.log(user);
        return axios.post(BASE_URL + 'users/login', user);
    },
    getHeader: () => {
        return {
            headers: {
                authorization: localStorage.getItem('token') //the token is a variable which holds the token
            }
        };
    },
    // for logout
    authLogOut: () => {
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('type');
        localStorage.removeItem('name');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('token');
        // this.router.navigate(['/login']);
    },

    authLogIn: (data) => {
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.dealer_name);
        localStorage.setItem('firstName', data.user.firstName);
        localStorage.setItem('lastName', data.user.lastName);
        localStorage.setItem('connected_dealer', data.user.connected_dealer);
        localStorage.setItem('type', data.user.user_type);
    },
    // checkAuth
    checkAuth: (response) => {
        if (response.success === false) {
            return false;
        } else {
            return true;
        }
    },

    // Component Allowed
    checkComponent: (ComponentUri) => {
        return axios.post(BASE_URL + 'users/check_component' , {ComponentUri:ComponentUri}, RestService.getHeader());
       
    },

    // isAdmin
    isAdmin: () => {
        // var self = this;
        // this.setHeaders(this.sessionLogin('token'));

        // this.response= this.http.get(this.baseUrl + '/users/check_admin',this.oHeaders);
        // return this.response;
    },

    // getuserType
    getUserType: () => {

    },

    // checkUserType
    checkUserType: () => {

    },

    // getMenu
    getMenu: () => {

    },

    // getDevices
    DeviceList: () => {
        return axios.get(BASE_URL + 'users/devices',
            RestService.getHeader()
        )

    },
    getSimIDs: () =>{
        return axios.get(BASE_URL + 'users/get_sim_ids', RestService.getHeader());
    },
    DealerList: (dealer) => {
        return axios.get(BASE_URL + 'users/dealers/' + dealer,
            {
                headers: {
                    authorization: localStorage.getItem('token') //the token is a variable which holds the token
                }
            }
        ).catch((error) => {
            // console.log(error);
        });
    },
    ApkList: () => {
        return axios.get(BASE_URL + 'users/apklist', RestService.getHeader());
    },

    toggleApk: (apkData) => {
        return axios.post(BASE_URL + 'users/toggle', apkData, RestService.getHeader());
    },

    // getDeviceDetails
    getDeviceDetails: (device_id) => {
        return axios.get(BASE_URL + 'users/connect/' + device_id, RestService.getHeader());
    },

    // connect devices for dealer dash.
    connectDevice: (device_id) => {
        // this.setHeaders(this.sessionLogin('token'));    

        // this.response = this.http.get(this.baseUrl + '/users/connect/' + device_id, this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    getDeviceApps: (device_id) => {
        return axios.get(BASE_URL + "users/get_apps/" + device_id, RestService.getHeader());

    },
    // getDealerInfo
    getDealer: (dealer_id) => {

    },

    // dealer profile
    getProfile: () => {
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.get(this.baseUrl + '/users/getinfo', this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    // For Dealer update
    updateDeviceDetails: (formData) => {
        return axios.put(BASE_URL + 'users/edit/devices', formData, RestService.getHeader());

        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.put(this.baseUrl + '/users/edit/devices', dealer, this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    // for dealer reset password(admin dashboard)
    updatePassword: (dealer) => {
        
        return axios.post(BASE_URL + 'users/resetpwd', dealer, RestService.getHeader());

        // let payload = {
        //   dealerId : dealer.dealerId,
        //   email: dealer.email,
        //   newpwd: dealer.newpwd
        // };
        // console.log(payload);

        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.post(this.baseUrl + '/users/resetpwd', dealer, this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    // For dealer(admin dashboard)
    updateDealerDetails: (formData) => {
        return axios.put(BASE_URL + 'users/edit/dealers', formData, RestService.getHeader());
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.put(this.baseUrl + '/users/edit/dealers', dealer, this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    // For Apk edit(admin dashboard)
    updateApkDetails: (formData) => {
        return axios.post(BASE_URL + 'users/edit/apk', formData, RestService.getHeader());
        // this.setHeaders(this.sessionLogin('token'));

        // const formData: FormData = new FormData();
        // formData.append('name', apk_name);
        // formData.append('logo', logo);
        // formData.append('apk', apk);
        // formData.append('apk_id', apk_id);

        // this.response = this.http.post(this.baseUrl + '/users/edit/apk', formData, this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    updateUserProfile: (formData) => {
        return axios.put(BASE_URL + 'users/updateProfile/'+formData, formData, RestService.getHeader());

    },

    getDeviceProfiles: (deviceId="") => {
        return axios.post(BASE_URL + 'users/get_profiles', {
            device_id: deviceId
        }, RestService.getHeader());
    },



    // for admin(all dealers)
    // getDealers: (pageType)=>{
    //     this.setHeaders(this.sessionLogin('token'));
    //     this.response = this.http.get(this.baseUrl + '/users/dealers/' + pageType, this.oHeaders);
    //     this.authtoken(this.response);
    //     return this.response;
    // },

    // For admin(all sdealers)
    // getUserSDealers() {
    //   this.setHeaders(this.sessionLogin('token'));
    //   console.log(this.baseUrl);
    //   this.response = this.http.get(this.baseUrl + '/users/sdealers', this.oHeaders);
    //   this.authtoken(this.response);
    //   console.log(this.response);
    //   return this.response;
    // }

    // For dealers(all sdealers)
    // getUserSubDealers: (dealer_id) =>{
    //     this.setHeaders(this.sessionLogin('token'));
    //     this.response = this.http.get(this.baseUrl + '/users/sdealers/' + dealer_id, this.oHeaders);
    //     this.authtoken(this.response);
    //     return this.response;
    // },

    // unlink Dealer.
    unlinkDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/delete', {dealer_id} , RestService.getHeader());
    },

    // unlink Device
    unlinkDevice: (id) => {

        return axios.post(BASE_URL + 'users/unlink/'+id, {id} , RestService.getHeader());

        // this.spinnerService.show();
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.post(this.baseUrl + '/users/unlink/' + device_id, '', this.oHeaders)
        // .subscribe(response => {
        //   this.spinnerService.hide();
        //   this.authtoken(response);
        //   console.log(response);
        //   Swal({
        //    text: 'Device unlink successfully',
        //    type: 'success'
        //   }).then(okay => {
        //    location.reload(true);
        //  });
        //  return this.response;
        //  });
    },
    // unlink (dealer-cevices) admin dash.
    // unlinkdealerUser: (dealer_id)=>{
    //     this.spinnerService.show();
    //     // console.log(this.baseUrl);
    //     this.setHeaders(this.sessionLogin('token'));
    //     this.response = this.http.delete(this.baseUrl + '/users/dealer/delete/' + dealer_id, this.oHeaders).subscribe(response => {
    //       this.spinnerService.hide();
    //       this.authtoken(response);
    //       this.response = response;
    //       console.log(response);
    //       Swal({
    //         text: this.response.msg,
    //         type: 'warning'
    //       }).then(okay => {
    //         location.reload(true);
    //       });
    //       return this.response;
    //     });
    // },

    // unlink (dealer-cevices) admin dash.
    unlinkAPK: (apk_id) => {
        return axios.post(BASE_URL + 'users/apk/delete', { apk_id: apk_id }, RestService.getHeader());
    },

    // suspend account
    suspendDevice: (device_id) => {
        return axios.post(BASE_URL + 'users/suspend/' + device_id, device_id,
            RestService.getHeader()
        )
    },

    // suspend dealer account
    suspendDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/suspend/',{dealer_id},
        RestService.getHeader()
        )
       
    },

    activateDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/activate/',{dealer_id},
        RestService.getHeader()
        )
    },

    // activate account
    activateDevice: (device_id) => {
        return axios.post(BASE_URL + 'users/activate/' + device_id, device_id,
            RestService.getHeader()
        )
    },

    deleteDevice: (device_id) => {
        // console.log(this.baseUrl);
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.delete(this.baseUrl + '/users/delete/' + device_id, this.oHeaders).subscribe(response => {
        // //   console.log(response);
        //    this.authtoken(this.response);
        //    Swal({
        //     text: this.response.msg,
        //     type: 'warning'
        //    }).then(okay => {
        //     location.reload(true);
        //   });
        //   return this.response;
        // });
    },

    // Undo For Dealer and Sub dealer
    undoDealer(dealer_id) {
        return axios.post(BASE_URL + 'users/dealer/undo', {dealer_id}, RestService.getHeader() )
    },

    // Undo For Dealer and Sub dealer
    undoDevice(id) {
        // this.token = this.sessionLogin('token');
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.post(this.baseUrl + '/users/dealer/undo', {dealerId: id}, this.oHeaders );
        // this.authtoken(this.response);
        // return this.response;
    },

    // addDealer
    addDealer: (dealer) => {
        return axios.post(BASE_URL + 'users/add/dealer', dealer, RestService.getHeader() )

        // console.log(dealer);
        // console.log(this.baseUrl);
        // this.setHeaders(this.sessionLogin('token'));
        // // dealer.dealerId = this.sessionLogin('id');
        // this.response = this.http.post(this.baseUrl + '/users/add/dealer', dealer, this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    addDevice: (devices) => {
        // console.log(devices);
        // console.log(this.baseUrl);
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.post(this.baseUrl + '/users/new/devices', devices,  this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },
    addAPK: (formData) => {
        return axios.post(BASE_URL + 'users/upload', formData, RestService.getHeader());
    },
    importCSV: (formData) =>{
        return axios.post(BASE_URL + 'users/import/sim_ids', formData, RestService.getHeader());
    },
    // Dealer and sdealers items apis
    getSelectedItems(pageName) {
        // console.log('page name', pageName);
        return axios.get(BASE_URL + 'users/dealer/gtdropdown/' + pageName, RestService.getHeader() );
        // this.authtoken(this.response);
        // return this.response;
    },

    // postSelectedItem
    postSelectedItems: (selectedItems, pageName) => {
        
        const items = JSON.stringify(selectedItems);
        return axios.post(BASE_URL + 'users/dealer/dropdown', { selected_items: items, pageName: pageName}, RestService.getHeader() );
        
    },

    // applySettings
    applySettings: (device_setting, device_id=null, type = "history", name = null, dealer_id = 0) => {
        // console.log(device_setting);
        if(device_setting.app_list !== undefined){ 
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
        }
        return axios.post(BASE_URL + 'users/apply_settings/' + device_id, {
            device_setting,
          type: type,
          name: name,
          dealer_id: dealer_id
        }, RestService.getHeader());
    
    },

    deleteProfile: (profileId) => {
        // this.setHeaders(this.sessionLogin('token'));
        // this.http.delete(this.baseUrl + '/users/delete_profile/' + profileId, this.oHeaders).subscribe(resp => {
        //   this.authtoken(resp);
        // });
    },

    // Dealer and sdealers items apis
    checkPass: (currentPass) => {
        // this.setHeaders(this.sessionLogin('token'));
        // // tslint:disable-next-line:max-line-length
        // this.response = this.http.post(this.baseUrl + '/users/check_pass/' , {password:currentPass},this.oHeaders);
        // this.authtoken(this.response);
        // return this.response;
    },

    // for authentication token
    authtoken: (response) => {
        // if (response.success === false && response.message === 'Failed to authenticate token.') {
        //     Swal({
        //     text: response.message,
        //     type: 'error',
        //     customClass: 'swal-height'
        //     }).then(okay => {
        //     this.router.navigate(['/login']);
        //     });
        // }
    },

    invalidPage() {

    },

    errorHandler(error) {
        // return error;
    }


}

export default RestService;