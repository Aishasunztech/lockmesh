import axios from 'axios';
import { BASE_URL } from '../../constants/Application';
import io from "socket.io-client";

const RestService = {
    // Login
    connectSocket: (token) => {
        let makeToken = "token=" + token + "&isWeb=true";
        let socket = io.connect(BASE_URL, {
            token: makeToken,
            // reconnectionDelay:1000,
            // reconnection:true,
            // forceNew:true
        });
        return socket;
    },
    login: (user) => {
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
        localStorage.removeItem('dealer_pin');
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
        localStorage.setItem('dealer_pin', data.user.link_code);
    },
    setUserData: (data) => {
        // console.log("hello12312", data);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('id', data.user.id);
        // // localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.dealer_name);
        localStorage.setItem('firstName', data.user.firstName);
        localStorage.setItem('lastName', data.user.lastName);
        localStorage.setItem('connected_dealer', data.user.connected_dealer);
        localStorage.setItem('type', data.user.user_type);
        localStorage.setItem('dealer_pin', data.user.link_code);

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
        return axios.post(BASE_URL + 'users/check_component', { ComponentUri: ComponentUri }, RestService.getHeader());

    },
    getUser: () => {
        return axios.get(BASE_URL + 'users/get_user', RestService.getHeader());
    },
    // isAdmin
    isAdmin: () => {
        // var self = this;
        // this.setHeaders(this.sessionLogin('token'));

        // this.response= this.http.get(this.baseUrl + '/users/check_admin',this.oHeaders);
        // return this.response;
    },
    transferDeviceProfile: (device_id) => {
        return axios.post(BASE_URL + 'users/transfer/device_profile', { device_id: device_id }, RestService.getHeader());
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

    // getNewDevices
    NewDeviceList: () => {
        return axios.get(BASE_URL + 'users/new/devices',
            RestService.getHeader()
        )

    },
    getSimIDs: () => {
        return axios.get(BASE_URL + 'users/get_sim_ids', RestService.getHeader());
    },
    getChatIDs: () => {
        return axios.get(BASE_URL + 'users/get_chat_ids', RestService.getHeader());
    },
    getPGPEmails: () => {
        return axios.get(BASE_URL + 'users/get_pgp_emails', RestService.getHeader());
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
    getDefaultApps: () => {
        return axios.get(BASE_URL + "users/default_apps", RestService.getHeader());
    },

    getUserAccountId: (d) => {
        console.log('rest ser')
        return axios.get(BASE_URL + "users/get_usr_acc_id/" + d, RestService.getHeader());
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
    },

    // for dealer reset password(admin dashboard)
    updatePassword: (dealer) => {

        return axios.post(BASE_URL + 'users/resetpwd', dealer, RestService.getHeader());

    },

    // For dealer(admin dashboard)
    updateDealerDetails: (formData) => {
        return axios.put(BASE_URL + 'users/edit/dealers', formData, RestService.getHeader());

    },

    // For Apk edit(admin dashboard)
    updateApkDetails: (formData) => {
        return axios.post(BASE_URL + 'users/edit/apk', formData, RestService.getHeader());

    },

    updateUserProfile: (formData) => {
        return axios.put(BASE_URL + 'users/updateProfile/' + formData, formData, RestService.getHeader());

    },

    getDeviceHistory: (device_id = "") => {
        return axios.post(BASE_URL + 'users/get_device_history', {
            device_id: device_id
        }, RestService.getHeader());
    },

    getDeviceProfiles: (device_id = "") => {
        return axios.post(BASE_URL + 'users/get_profiles', {
            device_id: device_id
        }, RestService.getHeader());
        
    },

    // unlink Dealer.
    unlinkDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/delete', { dealer_id }, RestService.getHeader());
    },

    // unlink Device
    unlinkDevice: (id) => {

        return axios.post(BASE_URL + 'users/unlink/' + id, { id }, RestService.getHeader());

    },


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
        return axios.post(BASE_URL + 'users/dealer/suspend/', { dealer_id },
            RestService.getHeader()
        )

    },

    activateDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/activate/', { dealer_id },
            RestService.getHeader()
        )
    },

    // activate account
    activateDevice: (device_id) => {
        return axios.post(BASE_URL + 'users/activate/' + device_id, device_id,
            RestService.getHeader()
        )
    },

    rejectDevice: (device) => {
        console.log(device);
        return axios.put(BASE_URL + 'users/delete/' + device.device_id, device, RestService.getHeader());
    },

    // Undo For Dealer and Sub dealer
    undoDealer(dealer_id) {
        return axios.post(BASE_URL + 'users/dealer/undo', { dealer_id }, RestService.getHeader())
    },

    // Undo For Dealer and Sub dealer
    undoDevice(id) {
        // this.token = this.sessionLogin('token');
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.post(this.baseUrl + '/users/dealer/undo', {dealerId: id}, this.oHeaders );
        // this.authtoken(this.response);
        // return this.response;
    },
    addDevice: (device) => {
        return axios.put(BASE_URL + 'users/new/device', device, RestService.getHeader());

    },
    preActiveDevice: (device) => {
        return axios.post(BASE_URL + 'users/create/device_profile', device, RestService.getHeader());
    },
    // addDealer
    addDealer: (dealer) => {
        return axios.post(BASE_URL + 'users/add/dealer', dealer, RestService.getHeader())

    },

    addAPK: (formData) => {
        return axios.post(BASE_URL + 'users/upload', formData, RestService.getHeader());
    },
    importCSV: (formData, fieldName) => {
        return axios.post(BASE_URL + 'users/import/' + fieldName, formData, RestService.getHeader());
    },
    exportCSV: (fieldName) => {
        return axios.get(BASE_URL + 'users/export/' + fieldName, RestService.getHeader());
    },
    // Dealer and sdealers items apis
    getSelectedItems(pageName) {
        // console.log('page name', pageName);
        return axios.get(BASE_URL + 'users/dealer/gtdropdown/' + pageName, RestService.getHeader());
    },


    // postSelectedItem
    postSelectedItems: (selectedItems, pageName) => {

        const items = JSON.stringify(selectedItems);
        return axios.post(BASE_URL + 'users/dealer/dropdown', { selected_items: items, pageName: pageName }, RestService.getHeader());

    },

    // applySettings
    applySettings: (device_setting, device_id = null, type = "history", name = null, dealer_id = 0, usr_acc_id) => {
        //  console.log('device settings', device_setting, 'device id ', device_id,'name', name, 'type',type );
        if (device_setting.app_list !== undefined) {
            device_setting.app_list.forEach((elem) => {
                elem.packageName = elem.uniqueName.replace(elem.label, '');
                if (elem.guest) {
                    elem.guest = true;
                } else {
                    elem.guest = false;
                }
                if (elem.encrypted) {
                    elem.encrypted = true;
                } else {
                    elem.encrypted = false;
                }
                if (elem.enable) {
                    elem.enable = true;
                } else {
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
            dealer_id: dealer_id,
            usr_acc_id: usr_acc_id
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

    invalidPage: () => {

    },
    getFile: (filename) => {
        window.location = BASE_URL + 'users/getFile/' + filename;
    },
    postPagenation: (selectedValue, pageName) => {
        return axios.post(BASE_URL + 'users/dealer/postPagination', { selectedValue: selectedValue, pageName: pageName }, RestService.getHeader())
    },
    getPagination(pageName) {
        // console.log('page name', pageName);
        return axios.get(BASE_URL + 'users/dealer/getPagination/' + pageName, RestService.getHeader());
        // this.authtoken(this.response);
        // return this.response;
    },

}

export default RestService;