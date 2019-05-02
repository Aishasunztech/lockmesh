import {
    DEVICES_LIST,
    SUSPEND_DEVICE,
    CONNECT_DEVICE,
    EDIT_DEVICE,
    SET_VISIBILITY_FILTER,
    ACTIVATE_DEVICE,
    LOADING,
    INVALID_TOKEN,
    GET_SIM_IDS,
    GET_CHAT_IDS,
    GET_PGP_EMAILS,
    REJECT_DEVICE,
    PRE_ACTIVATE_DEVICE,
    DELETE_UNLINK_DEVICE,
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

// action creaters 

export function getDevicesList() {

    return (dispatch) => {
        dispatch({
            type: LOADING,
            isloading: true
        });
        RestService.DeviceList().then((response) => {
            // console.log("data form server");
            // console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data)
                if (response.data.status) {

                    dispatch({
                        type: DEVICES_LIST,
                        payload: response.data.data,
                        response: response.data,

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
export function editDevice(formData) {
    return (dispatch) => {
        // console.log('edit form data ', formData);
        RestService.updateDeviceDetails(formData).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_DEVICE,
                    response: response.data,
                    payload: {
                        formData: formData,
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

export function deleteUnlinkDevice(action, devices) {
    return (dispatch) => {
        // alert("hello");
        // console.log(devices);
        RestService.deleteUnlinkDevice(action, devices).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('successfully ', response.data);
                dispatch({
                    type: DELETE_UNLINK_DEVICE,
                    response: response.data,
                    payload: {
                        formData: devices
                    }
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function suspendDevice(device) {

    return (dispatch) => {
        // console.log("suspendDevice action");

        RestService.suspendDevice(device.usr_device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {

                //   device.account_status = "suspended";

                if (response.data.status) {
                    dispatch({
                        type: SUSPEND_DEVICE,
                        response: response.data,
                        payload: {
                            // device: device,
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

export function activateDevice(device) {

    return (dispatch) => {

        RestService.activateDevice(device.usr_device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                device.account_status = '';

                if (response.data.status) {
                    dispatch({
                        type: ACTIVATE_DEVICE,
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


export function connectDevice(device_id) {

    return { type: CONNECT_DEVICE, device_id }

}

export function setVisibilityFilter(filter) {

    return { type: SET_VISIBILITY_FILTER, filter }

}

export function getSimIDs() {
    return (dispatch) => {

        RestService.getSimIDs().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_SIM_IDS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}

export function getChatIDs() {
    return (dispatch) => {

        RestService.getChatIDs().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_CHAT_IDS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}

export function getPGPEmails() {
    return (dispatch) => {
        // alert("hello");
        RestService.getPGPEmails().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_PGP_EMAILS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}



export function rejectDevice(device) {
    return (dispatch) => {
        // console.log(device)
        RestService.rejectDevice(device).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: REJECT_DEVICE,
                    response: response.data,
                    device_id: device,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function addDevice(device) {
    return (dispatch) => {
        // alert("hello");
        RestService.addDevice(device).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_DEVICE,
                    response: response.data,
                    payload: {
                        formData: device,
                    }
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function preActiveDevice(device) {
    // console.log("action called", device);
    return (dispatch) => {
        RestService.preActiveDevice(device).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('action done ', response.data);
                dispatch({
                    type: PRE_ACTIVATE_DEVICE,
                    response: response.data,
                    payload: {
                        formData: device,
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}