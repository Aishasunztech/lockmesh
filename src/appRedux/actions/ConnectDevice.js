import {
    GET_DEVICE_DETAILS,
    INVALID_TOKEN,
    GET_DEVICE_APPS,
    GET_PROFILES,
    GET_DEVICE_HISTORIES,
    PUSH_APPS,
    UNDO_APPS,
    REDO_APPS,
    SETTINGS_APPLIED,
    START_LOADING,
    END_LOADING,
    SHOW_MESSAGE,
    LOAD_PROFILE,
    UNLINK_DEVICE,
    CHANGE_PAGE,
    SHOW_HISTORY_MODAL,
    SHOW_SAVE_PROFILE_MODAL,
    SAVE_PROFILE,
    ACTIVATE_DEVICE2,
    SUSPEND_DEVICE2,
    HANDLE_CHECK_APP,
    HANDLE_CHECK_ALL,
    GET_USER_ACC_ID
} from "constants/ActionTypes"

import RestService from '../services/RestServices';

// action creaters 

export function changePage(pageName) {
    return {
        type: CHANGE_PAGE,
        payload: pageName
    }
}

export function getDeviceDetails(deviceId) {

    return (dispatch) => {
        RestService.getDeviceDetails(deviceId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log("slkdflaskdfjlasf", response.data);
                if (response.data) {
                    dispatch({
                        type: GET_DEVICE_DETAILS,
                        payload: response.data
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };

}

export function getDeviceApps(deviceId) {
    return (dispatch) => {
        RestService.getDeviceApps(deviceId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_DEVICE_APPS,
                        payload: response.data.app_list
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function getProfiles() {
    return (dispatch) => {
        RestService.getDeviceProfiles().then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_PROFILES,
                        payload: response.data.profiles
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function getDeviceHistories(deviceId) {
    return (dispatch) => {
        RestService.getDeviceProfiles(deviceId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_DEVICE_HISTORIES,
                        payload: response.data.profiles
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function getAccIdFromDvcId(deviceId) {
  //  console.log('Do it')
    return (dispatch) => {
        RestService.getUserAccountId(deviceId).then((response) => {
         //  console.log('t e s t', response );
           if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_USER_ACC_ID,
                    response: response.data,
                    payload: {
                      
                    }
                });
          
        } else {
            dispatch({
                type: INVALID_TOKEN
            });
        }
        });
    }
}

export function suspendDevice2(device) {

    return (dispatch) => {
        //  console.log("suspendDevice action");

        RestService.suspendDevice(device.usr_device_id).then((response) => {
          

            if (RestService.checkAuth(response.data)) {
                // console.log('reslut', response);
                    // console.log('conect device', device);
                    // console.log('done status');
                    dispatch({
                        type: SUSPEND_DEVICE2,
                        response: response.data,
                        payload: {
                            device: device,
                            msg: response.data.msg,
                        }
                    });
              

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }


}

export function unlinkDevice(deviceId) {
    return (dispatch) => {
        RestService.unlinkDevice(deviceId).then((response) => {
            // console.log('response to unlink device', response);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        response:response.data,
                        type: UNLINK_DEVICE,
                        payload: response.data.profiles
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function activateDevice2(device) {

    // console.log('device', device);

    return (dispatch) => {

        RestService.activateDevice(device.usr_device_id).then((response) => {
            // console.log('conect device method call', device);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);

                if (response.data.status) {
                    dispatch({
                        type: ACTIVATE_DEVICE2,
                        response: response.data,
                        payload: {
                            device: device,
                            msg: response.data.msg,
                        }
                    });
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }

}

export function saveDeviceProfile(profileName, deviceSettings) {
}

export function showHistoryModal(visible, profileType = "") {

    return {
        type: SHOW_HISTORY_MODAL,
        payload: {
            visible: visible,
            profileType: profileType
        }
    }
}

export function loadDeviceProfile(app_list) {
    return {
        type: LOAD_PROFILE,
        payload: JSON.parse(app_list)
    };
}

export function applySetting(app_list, passwords, device_id, type = "history", name = null) {
    return (dispatch) => {
        let device_setting = {
            app_list: app_list,
            passwords: {
                admin_password: (passwords.adminPwd === '') ? null : passwords.adminPwd,
                guest_password: (passwords.guestPwd === '') ? null : passwords.guestPwd,
                encrypted_password: (passwords.encryptedPwd === '') ? null : passwords.encryptedPwd,
                duress_password: (passwords.duressPwd === '') ? null : passwords.duressPwd
            },
            controls: {}
        }
        RestService.applySettings(device_setting, device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: SHOW_MESSAGE,
                        payload: {
                            showMessage: true,
                            messageType: 'success',
                            messageText: "settings are applied"
                        }
                    })
                    dispatch({
                        type: SETTINGS_APPLIED,
                        payload: response.data
                    })
                    dispatch({
                        type: SHOW_MESSAGE,
                        payload: {
                            showMessage: false,
                            messageType: 'success',
                            messageText: 'settings are applied'
                        }
                    })
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export function undoApps() {
    return (dispatch) => {
        dispatch({
            type: UNDO_APPS
        })
    }
}

export function redoApps() {
    return (dispatch) => {
        dispatch({
            type: REDO_APPS
        })
    }
}

export function pushApps(app_list) {
    // console.log("app_list", app_list);
    return (dispatch) => {
        dispatch({
            type: PUSH_APPS,
            payload: app_list
        })
    }

}

export function startLoading() {
    return {
        type: START_LOADING
    }
}

export function endLoading() {
    return {
        type: END_LOADING
    }
}
export function showMessage(show, message, type) {

    // dispatch({
    //     type:SHOW_MESSAGE,
    //     payload:{ 
    //         showMessage: show,
    //         messageType: message,
    //         messageText: type
    //     }
    // })
}

export function handleCheckApp(e, key, app_id) {
    return (dispatch) =>{
        dispatch({
            type: HANDLE_CHECK_APP,
            payload: {
                value: e,
                key: key,
                app_id: app_id
            }
        })
    }
}

export function handleCheckAll(keyAll, key, value) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_ALL,
            payload: {
                keyAll: keyAll,
                key: key,
                value: value
            }
        })
    }
}


export function submitPassword(passwords, pwdType) {
    return (dispatch) => {
        dispatch({
            type: SHOW_MESSAGE,
            payload: {
                showMessage: true,
                messageType: 'success',
                messageText: "Password saved"
            }
        })
        dispatch({
            type: pwdType,
            payload: passwords
        })
        dispatch({
            type: SHOW_MESSAGE,
            payload: {
                showMessage: false,
                messageType: 'success',
                messageText: "Password saved"
            }
        })
    }
}

export function showSaveProfileModal(visible, profileType = '') {
    return (dispatch) => {
        dispatch({
            type: SHOW_SAVE_PROFILE_MODAL,
            payload: {
                visible: visible,
                profileType: profileType
            }
        })
    }
}
export function hanldeProfileInput(profileType, profileValue) {
    return (dispatch) => {
        dispatch({
            type: profileType,
            payload: profileValue
        })
    }
}
export function saveProfile(app_list, passwords = null, profileType, profileName) {
    return (dispatch) => {
        let pwd = {};
        if (passwords != null) {
            pwd = {
                admin_password: (passwords.adminPwd === '') ? null : passwords.adminPwd,
                guest_password: (passwords.guestPwd === '') ? null : passwords.guestPwd,
                encrypted_password: (passwords.encryptedPwd === '') ? null : passwords.encryptedPwd,
                duress_password: (passwords.duressPwd === '') ? null : passwords.duressPwd
            }
        } else {
            pwd = {
                admin_password: null,
                guest_password: null,
                encrypted_password: null,
                duress_password: null
            }
        }
        let device_setting = {
            app_list: app_list,
            passwords: pwd,
            controls: {}
        }
        // console.log("applist save profile", app_list);
        RestService.applySettings(device_setting, null, profileType, profileName).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: true,
                        messageType: 'success',
                        messageText: "Profile saved successfully"
                    }
                })
                dispatch({
                    type: SAVE_PROFILE
                })
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: false,
                        messageType: 'success',
                        messageText: "Profile saved successfully"
                    }
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }

        })

    }

}

export const transferDeviceProfile =(device_id) =>{
    // alert(device_id);
    return (dispatch) => {
        RestService.transferDeviceProfile(device_id).then((response) => {
            if (RestService.checkAuth(response.data)){
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: true,
                        messageType:  response.data.status ? 'success' : 'error',
                        messageText: response.data.data.msg
                    }
                })
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: false,
                        messageType:  response.data.status ? 'success' : 'error',
                        messageText: response.data.data.msg
                    }
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}