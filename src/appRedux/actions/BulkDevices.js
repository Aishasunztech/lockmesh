import { BULK_DEVICES_LIST, BULK_SUSPEND_DEVICES, LOADING, INVALID_TOKEN, BULK_LOADING, BULK_ACTIVATE_DEVICES, BULK_HISTORY, BULK_USERS, BULK_PUSH_APPS, SET_PUSH_APPS, SET_PULL_APPS, BULK_PULL_APPS, SET_SELECTED_BULK_DEVICES, WIPE_BULK_DEVICES, UNLINK_BULK_DEVICES, CLOSE_RESPONSE_MODAL } from "../../constants/ActionTypes";

import RestService from '../services/RestServices';






export function getBulkDevicesList(data) {
    // console.log('at action file ', data)

    return (dispatch) => {
        dispatch({
            type: BULK_LOADING,
            isloading: true
        });
        RestService.getBulkDevicesList(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    // console.log('at action file on response', response)
                    dispatch({
                        type: BULK_DEVICES_LIST,
                        payload: response.data,

                    });
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}

export function bulkSuspendDevice(devices) {

    // console.log("bulkSuspendDevice action file =========> ", devices);
    return (dispatch) => {

        RestService.bulkSuspendDevice(devices).then((response) => {

            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                // if (response.data.status) {
                dispatch({
                    type: BULK_SUSPEND_DEVICES,
                    payload: response.data,
                });
                // }


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }


}


export function bulkActivateDevice(devices) {
    // console.log('bulkActivateDevice at action file ', devices)
    return (dispatch) => {

        RestService.bulkActivateDevice(devices).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: BULK_ACTIVATE_DEVICES,
                    payload: response.data,
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }

}

export function getbulkHistory() {

    return (dispatch) => {
        RestService.getbulkHistory().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);

                if (response.data) {
                    dispatch({
                        type: BULK_HISTORY,
                        payload: response.data,
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

// export function getUsersOfDealers(data) {
//     console.log("getUsersOfDealers ", data)
//     return (dispatch) => {
//         RestService.getUsersOfDealers(data).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 // console.log('response', response.data);

//                 if (response.data) {
//                     dispatch({
//                         type: BULK_USERS,
//                         payload: response.data,
//                     });
//                 }

//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 });
//             }
//         });
//     }

// }




export const setBulkPushApps = (apps) => {
    apps.forEach((el) => {
        el.enable = (typeof (el.enable) === Boolean || typeof (el.enable) === 'Boolean' || typeof (el.enable) === 'boolean') ? el.enable : false;
        el.guest = (typeof (el.guest) === Boolean || typeof (el.guest) === 'Boolean' || typeof (el.guest) === 'boolean') ? el.guest : false;
        el.encrypted = (typeof (el.encrypted) === Boolean || typeof (el.encrypted) === 'Boolean' || typeof (el.encrypted) === 'boolean') ? el.encrypted : false;
        delete el.apk_logo;
        delete el.apk_status;
    })
    return (dispatch) => {
        dispatch({
            type: SET_PUSH_APPS,
            payload: apps,
        })
    }
}

export const applyBulkPushApps = (data) => {
    return (dispatch) => {
        RestService.applyBulkPushApps(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: BULK_PUSH_APPS,
                    payload: response.data,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}


// Set Pull apps 
export const setBulkPullApps = (apps) => {
    apps.forEach((el) => {

        delete el.icon;
        el.apk_id = el.key;
        el.apk_name = el.label;
        el.version_name = "";
        el.apk = "";
        el.guest = false;
        el.encrypted = false;
        el.enable = false;
    })
    return (dispatch) => {
        dispatch({
            type: SET_PULL_APPS,
            payload: apps

        })
    }
}

export const applyBulkPullApps = (data) => {
    return (dispatch) => {
        RestService.applyBulkPullApps(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: BULK_PULL_APPS,
                    payload: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

// Set Selected Devices
export const setSelectedBulkDevices = (data) => {
    return (dispatch) => {
        dispatch({
            type: SET_SELECTED_BULK_DEVICES,
            payload: data

        })
    }
}

export function unlinkBulkDevices(data) {
    console.log('you are at action file of unlinkBulkDevices', data)
    return (dispatch) => {
        RestService.unlinkBulkDevices(data).then((response) => {
            // console.log('response to unlink device', response);
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    payload: response.data,
                    type: UNLINK_BULK_DEVICES,
                    // payload: device,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function wipeBulkDevices(device) {
    return (dispatch) => {
        RestService.wipeBulkDevices(device.usr_device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: WIPE_BULK_DEVICES,
                    response: response.data,
                });
            }
        });
    }
}

export function closeResponseModal() {
    return (dispatch) => {
        dispatch({
            type: CLOSE_RESPONSE_MODAL,
        });
    }
}
