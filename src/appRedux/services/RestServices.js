import axios from 'axios';
import { BASE_URL } from '../../constants/Application';
import io from "socket.io-client";

const RestService = {
    // Login
    connectSocket: (token) => {
        let makeToken = "token=" + token + "&isWeb=true";
        let socket = io.connect(BASE_URL, {
            query: makeToken,
            // reconnectionDelay:1000,
            // reconnection:true,
            // forceNew:true
        });
        return socket;
    },
    login: (user) => {
        return axios.post(BASE_URL + 'users/login', user);
    },
    verifyCode: (verifyForm) => {
        return axios.post(BASE_URL + 'users/verify_code', {
            verify_code: verifyForm.verify_code
        });
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
        localStorage.setItem('connected_devices', data.user.connected_devices[0].total);
        localStorage.setItem('type', data.user.user_type);
        localStorage.setItem('dealer_pin', data.user.link_code);
        localStorage.setItem('two_factor_auth', data.user.two_factor_auth);

    },
    setUserData: (data) => {
        // console.log("hello12312", data);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('name', data.user.dealer_name);
        localStorage.setItem('firstName', data.user.firstName);
        localStorage.setItem('lastName', data.user.lastName);
        localStorage.setItem('connected_dealer', data.user.connected_dealer);
        localStorage.setItem('connected_devices', data.user.connected_devices[0].total);
        localStorage.setItem('type', data.user.user_type);
        localStorage.setItem('dealer_pin', data.user.link_code);
        localStorage.setItem('two_factor_auth', data.user.two_factor_auth);

    },
    // checkAuth
    checkAuth: (response) => {
        if (response.success === false) {
            return false;
        } else {
            return true;
        }

    },
    twoFactorAuth: (isEnable) => {
        return axios.post(BASE_URL + 'users/two_factor_auth', { isEnable: isEnable }, RestService.getHeader())
    },
    // Component Allowed
    checkComponent: (ComponentUri) => {
        return axios.post(BASE_URL + 'users/check_component', { ComponentUri: ComponentUri }, RestService.getHeader());

    },

    // 
    getAllowedComponents: () => {

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

    transferDeviceProfile: (device_id) => {
        return axios.post(BASE_URL + 'users/transfer/device_profile', { device_id: device_id }, RestService.getHeader());
    },


    // getDevices
    DeviceList: () => {
        return axios.get(BASE_URL + 'users/devices',
            RestService.getHeader()
        )
    },

    deleteUnlinkDevice: (action, devices) => {
        return axios.put(BASE_URL + 'users/deleteUnlinkDevice', { action, devices }, RestService.getHeader())
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
    getUsedPGPEmails: () => {
        return axios.get(BASE_URL + 'users/get_used_pgp_emails', RestService.getHeader());
    },
    getUsedSimIds: () => {
        return axios.get(BASE_URL + 'users/get_used_sim_ids', RestService.getHeader());
    },
    getUsedChatIds: () => {
        return axios.get(BASE_URL + 'users/get_used_chat_ids', RestService.getHeader());
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
    getAllDealers: () => {
        return axios.get(BASE_URL + 'users/dealers',
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
        //console.log('rest apoi')
        return axios.get(BASE_URL + 'users/connect/' + device_id, RestService.getHeader());
    },
    // getAppJobQueue
    getAppJobQueue: (device_id) => {
        //console.log('rest apoi')
        return axios.get(BASE_URL + 'users/getAppJobQueue/' + device_id, RestService.getHeader());
    },

    reSyncDevice: (deviceId) => {
        return axios.patch(BASE_URL + 'users/sync-device', { device_id: deviceId }, RestService.getHeader());
    },

    savePolicy: (data) => {
        //console.log('rest apoi')
        return axios.post(BASE_URL + 'users/save_policy', { data }, RestService.getHeader());
    },

    // connect devices for dealer dash.
    getDealerApps: () => {

        return axios.get(BASE_URL + "users/get_dealer_apps", RestService.getHeader());
    },

    // connect devices for dealer dash.
    getAppPermissions: () => {
        //   console.log('api called ')
        return axios.get(BASE_URL + "users/get_app_permissions", RestService.getHeader());
    },

    deleteORStatusPolicy: (data) => {
        //   console.log('api called ')
        return axios.post(BASE_URL + "users/change_policy_status ", data, RestService.getHeader());
    },

    SavePolicyChanges: (record) => {
        console.log('api called ', record);
        let data = {
            id: record.id,
            push_apps: JSON.stringify(record.push_apps),
            controls: JSON.stringify(record.controls),
            permissions: JSON.stringify(record.secure_apps),
            app_list: JSON.stringify(record.app_list),
            policy_note: record.policy_note
        }
        return axios.post(BASE_URL + "users/save_policy_changes ", data, RestService.getHeader());
    },

    saveNewData: (data) => {
        return axios.post(BASE_URL + "users/save_new_data ", data, RestService.getHeader());
    },

    getDeviceApps: (device_id) => {
        return axios.get(BASE_URL + "users/get_apps/" + device_id, RestService.getHeader());

    },
    getDefaultApps: () => {
        return axios.get(BASE_URL + "users/default_apps", RestService.getHeader());
    },

    getUserAccountId: (d) => {
        // console.log('rest ser')
        return axios.get(BASE_URL + "users/get_usr_acc_id/" + d, RestService.getHeader());
    },
    saveAPKPermissions: (apkId, dealers, action) => {
        return axios.post(BASE_URL + 'users/save_apk_permissions', {
            apkId: apkId,
            dealers: dealers,
            action: action
        },
            RestService.getHeader()
        );
    },
    savePolicyPermissions: (policyId, dealers, action) => {
        return axios.post(BASE_URL + 'users/save_policy_permissions', {
            policyId: policyId,
            dealers: dealers,
            action: action
        },
            RestService.getHeader()
        );
    },

    //AUTHENTICATE UPDATE USER CREDENTIALS
    authenticateUpdateUser: (data) => {
        return axios.post(BASE_URL + 'users/authenticate_update_user', {
            email: data.email,
            pwd: data.pwd
        },
            RestService.getHeader()
        );
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
    // For check apk name 
    checkApkName: (name, apk_id = '') => {
        return axios.post(BASE_URL + 'users/checkApkName', { name, apk_id }, RestService.getHeader());
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
    getPolicies: () => {
        return axios.get(BASE_URL + 'users/get_policies', RestService.getHeader());

    },


    // unlink Dealer.
    unlinkDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/delete', { dealer_id }, RestService.getHeader());
    },

    // unlink Device
    unlinkDevice: (device) => {

        return axios.post(BASE_URL + 'users/unlink/' + device.usr_device_id, { device }, RestService.getHeader());

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
    wipe: (device_id) => {
        return axios.post(BASE_URL + 'users/wipe/' + device_id, device_id,
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
        // console.log(device);
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
        return axios.post(BASE_URL + 'users/addApk', formData, RestService.getHeader());
    },
    importCSV: (formData, fieldName) => {
        return axios.post(BASE_URL + 'users/import/' + fieldName, formData, RestService.getHeader());
    },
    exportCSV: (fieldName) => {
        return axios.get(BASE_URL + 'users/export/' + fieldName, RestService.getHeader());
    },
    releaseCSV: (fieldName, ids) => {
        return axios.post(BASE_URL + 'users/releaseCSV/' + fieldName, { ids }, RestService.getHeader());
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
    applySettings: (device_setting, device_id = null, usr_acc_id) => {
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
            usr_acc_id: usr_acc_id,
            device_id: device_id,
        }, RestService.getHeader());

    },

    applyPushApps: (push_apps, deviceId, usrAccId) => {
        return axios.post(BASE_URL + 'users/apply_pushapps/' + deviceId, {
            push_apps: push_apps,
            deviceId: deviceId,
            usrAccId: usrAccId
        }, RestService.getHeader());
    },

    applyPolicy: (deviceId, userAccId, policyId) => {
        return axios.post(BASE_URL + 'users/apply_policy/' + deviceId, {
            deviceId: deviceId,
            policyId: policyId,
            userAccId: userAccId
        }, RestService.getHeader());
    },

    applyPullApps: (pull_apps, deviceId, usrAccId) => {
        return axios.post(BASE_URL + 'users/apply_pullapps/' + deviceId, {
            pull_apps: pull_apps,
            deviceId: deviceId,
            usrAccId: usrAccId
        }, RestService.getHeader());
    },

    saveProfileCND: (device_setting, profileName = null, usr_acc_id) => {
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
        return axios.post(BASE_URL + 'users/save/profile', {
            device_setting,
            usr_acc_id: usr_acc_id,
            profileName: profileName,
            // device_id:device_id,
        }, RestService.getHeader());

    },

    deleteProfile: (profileId) => {
        // this.setHeaders(this.sessionLogin('token'));
        // this.http.delete(this.baseUrl + '/users/delete_profile/' + profileId, this.oHeaders).subscribe(resp => {
        //   this.authtoken(resp);
        // });
    },

    // Check pass 
    checkPass: (user) => {
        return axios.post(BASE_URL + 'users/check_pass', { user }, RestService.getHeader());
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
    //Unflagg Device
    unflagged(device_id) {
        // alert("dadsada")
        return axios.post(BASE_URL + 'users/UnflagDevice/' + device_id, {}, RestService.getHeader());
    },
    //flag Device
    flagged(device_id, data) {
        return axios.post(BASE_URL + 'users/flagDevice/' + device_id, { data }, RestService.getHeader());

    },
    //GET IMEI History
    getImeiHistory: (device_id) => {
        return axios.get(BASE_URL + "users/get_imei_history/" + device_id, RestService.getHeader());
    },

    getActivities: (device_id) => {
        return axios.get(BASE_URL + "users/get_activities/" + device_id, RestService.getHeader());
    },

    //GET User List
    userList: () => {
        return axios.get(BASE_URL + 'users/userList',
            RestService.getHeader()
        )
    },

    writeImei(device_id, usrAccId, type, imeiNo, device) {
        return axios.post(BASE_URL + 'users/writeImei/' + device_id, { usrAccId, type, imeiNo, device }, RestService.getHeader());
    },

    // ADD new user
    addUser: (user) => {
        return axios.post(BASE_URL + 'users/add/user', user, RestService.getHeader())
    },

    //EDIT user
    editUser: (user) => {
        return axios.post(BASE_URL + 'users/edit/user', user, RestService.getHeader())
    },
    //DELETE user
    deleteUser: (userId) => {
        return axios.put(BASE_URL + 'users/delete_user/' + userId, {}, RestService.getHeader())
    },
    //UNDO DELETE user
    undoDeleteUser: (userId) => {
        return axios.put(BASE_URL + 'users/undo_delete_user/' + userId, {}, RestService.getHeader())
    },

    // Transfer Secure market Apps 
    transferApps: (data) => {
        return axios.post(BASE_URL + 'users/transferApps', { data }, RestService.getHeader())
    },
    // Change unistall app restriction for Secure market apps 
    handleUninstall: (apk_id, value) => {
        return axios.put(BASE_URL + 'users/handleUninstall/' + apk_id, { value }, RestService.getHeader())
    },
    getMarketApps: () => {
        return axios.get(BASE_URL + 'users/marketApplist', RestService.getHeader())
    },

    defaultPolicyChange: (enable, policy_id) => {
        return axios.post(BASE_URL + 'users/set_default_policy', { enable, policy_id }, RestService.getHeader())
    },


}
export default RestService;