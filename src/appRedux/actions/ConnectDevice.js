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
    GET_USER_ACC_ID,
    FLAG_DEVICE,
    UNFLAG_DEVICE,
    WIPE_DEVICE,
    CHECKPASS,
    GET_DEALER_APPS,
    HANDLE_CHECK_EXTENSION,
    HANDLE_CHECK_ALL_EXTENSION,
    UNDO_EXTENSIONS,
    REDO_EXTENSIONS,
    HANDLE_CHECK_CONTROL,
    UNDO_CONTROLS,
    REDO_CONTROLS,
    GET_APPS_PERMISSIONS

} from "../../constants/ActionTypes"

import {
    message
} from 'antd';
import RestService from '../services/RestServices';
import { GET_POLICIES } from "../../constants/ActionTypes";

// action creaters 

export function changePage(pageName) {
    return {
        type: CHANGE_PAGE,
        payload: pageName
    }
}

export function getDeviceDetails(deviceId) {
    //console.log('object is callse')
    return (dispatch) => {
        RestService.getDeviceDetails(deviceId).then((response) => {
            // console.log("slkdflaskdfjlasf", response.data);
            if (RestService.checkAuth(response.data.status)) {
                //    console.log("slkdflaskdfjlasf", response.data);
                if (response.data) {
                    dispatch({
                        type: GET_DEVICE_DETAILS,
                        payload: response.data.data
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
            // console.log('dat form sercer', response.data)
            if (RestService.checkAuth(response.data)) {
                // console.log('dat form sercer', response.data)
                if (response.data.status) {
                    dispatch({
                        type: GET_DEVICE_APPS,
                        payload: response.data.app_list,
                        extensions: response.data.extensions,
                        controls: response.data.controls
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

export function getProfiles(device_id) {
    return (dispatch) => {
        RestService.getDeviceProfiles(device_id).then((response) => {

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

export function getAppPermissions(device_id) {
    return (dispatch) => {
        RestService.getAppPermissions(device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_APPS_PERMISSIONS,
                        payload: response.data
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

export function getPolicies(device_id) {
    return (dispatch) => {
        RestService.getPolicies(device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_POLICIES,
                        payload: response.data.policies
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

export function getDeviceHistories(user_acc_id) {
    return (dispatch) => {
        RestService.getDeviceHistory(user_acc_id).then((response) => {
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
export function wipe(device) {
    RestService.wipe(device.usr_device_id).then((response) => {

        if (RestService.checkAuth(response.data)) {
            // console.log('reslut', response);
            // console.log('conect device', device);
            // console.log('done status');
            // dispatch({
            //     type: WIPE_DEVICE,
            //     response: response.data,
            //     payload: {
            //         device: device,
            //         msg: response.data.msg,
            //     }
            // });
            message.success(response.data.msg);
        }
        else {
            message.error("Device Not Wiped.Please Try again.")
        }
    });
}

export function unlinkDevice(device) {
    return (dispatch) => {
        RestService.unlinkDevice(device).then((response) => {
            // console.log('response to unlink device', response);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        response: response.data,
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

export function applySetting(app_list, passwords, device_id, usr_acc_id, type = "history", name = null,extensions, controls ) {
//    console.log('apply Settings', extensions);
    return (dispatch) => {
        let device_setting = {
            app_list: app_list,
            passwords: {
                admin_password: (passwords.adminPwd === '') ? null : passwords.adminPwd,
                guest_password: (passwords.guestPwd === '') ? null : passwords.guestPwd,
                encrypted_password: (passwords.encryptedPwd === '') ? null : passwords.encryptedPwd,
                duress_password: (passwords.duressPwd === '') ? null : passwords.duressPwd
            },
            controls: controls,
            extensions: extensions
        }
    //  console.log('my test is ', extensions)
        RestService.applySettings(device_setting, device_id, type = "history", null, null, usr_acc_id, extensions, controls).then((response) => {
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

export function undoControls() {
    return (dispatch) => {
        dispatch({
            type: UNDO_CONTROLS
        })
    }
}

export function redoControls() {
    return (dispatch) => {
        dispatch({
            type: REDO_CONTROLS
        })
    }
}

export function undoExtensions(){
    return (dispatch) => {
        dispatch({
            type: UNDO_EXTENSIONS
        })
    }
}
export function redoExtensions(){
    console.log('redo ex action')
    return (dispatch) => {
        dispatch({
            type: REDO_EXTENSIONS
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



export function handleControlCheck(e, key ) {
     console.log('name in action', e, key)
     return (dispatch) => {
         dispatch({
             type: HANDLE_CHECK_CONTROL,
             payload: {
                 value: e,
                 key: key,
             }
         })
     }
 }

export function handleCheckExtension(e, key, app_id, uniqueName) {
   // console.log('name in action', uniqueName)
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_EXTENSION,
            payload: {
                value: e,
                key: key,
                app_id: app_id,
                uniqueName:uniqueName
            }
        })
    }
}

export function handleCheckApp(e, key, app_id) {
    return (dispatch) => {
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

export function handleCheckAllExtension(keyAll, key, value,uniqueName) {
    console.log('actoin is called')
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_ALL_EXTENSION,
            payload: {
                keyAll: keyAll,
                key: key,
                value: value,
                uniqueName: uniqueName
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
export function saveProfile(app_list, passwords = null, profileType, profileName, usr_acc_id) {
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
        // console.log("applist save profile", device_setting);
        RestService.applySettings(device_setting, null, profileType, profileName, null, usr_acc_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: true,
                        messageType: (response.data.status === true) ? 'success' : 'error',
                        messageText: response.data.msg
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

export const transferDeviceProfile = (device_id) => {
    // alert(device_id);
    return (dispatch) => {
        RestService.transferDeviceProfile(device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: true,
                        messageType: response.data.status ? 'success' : 'error',
                        messageText: response.data.data.msg
                    }
                })
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: false,
                        messageType: response.data.status ? 'success' : 'error',
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
export const unflagged = (device_id) => {
    return (dispatch) => {
        RestService.unflagged(device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: UNFLAG_DEVICE,
                    response: response.data,
                    payload: {
                        // device: response.data.data,
                        msg: response.data.msg,
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
export const flagged = (device_id, data) => {
    return (dispatch) => {
        RestService.flagged(device_id, data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: FLAG_DEVICE,
                    response: response.data,
                    payload: {
                        device: response.data.data,
                        msg: response.data.msg,
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
export const checkPass = (user) => {
    // console.log(user);
    return (dispatch) => {
        RestService.checkPass(user).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: CHECKPASS,
                    response: response.data,
                    payload: {
                        device: user.device,
                        PasswordMatch: response.data,
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

export const getDealerApps = () => {
    console.log('get dealer action id')
    return (dispatch) => {
        console.log('in return of fucntion')
        RestService.getDealerApps().then((response) => {
            if (RestService.checkAuth(response.data)) {
                console.log('get dealer apps resoo', response.data)
                dispatch({
                    type: GET_DEALER_APPS,
                    payload: response.data.list
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}