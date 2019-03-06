import {
    DEVICES_LIST,
    SUSPEND_DEVICE,
    CONNECT_DEVICE,
    EDIT_DEVICE,
    SET_VISIBILITY_FILTER,
    ACTIVATE_DEVICE,
    LOADING,
    INVALID_TOKEN,
    GET_SIM_IDS
} from "constants/ActionTypes";

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
                if (response.data.status) {

                }
                dispatch({
                    type: DEVICES_LIST,
                    payload: response.data.data,
                    response: response.data,

                });
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
        // console.log(formData);
        RestService.updateDeviceDetails(formData).then((response) => {
            // console.log("data form server");
            // console.log(response.data);
            if (RestService.checkAuth(response.data)) {

                if (response.data.status) {
                    dispatch({
                        type: EDIT_DEVICE,
                        response: response.data,
                        payload: {
                            formData: formData,
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

export function suspendDevice(device) {

    return (dispatch) => {
        // console.log("suspendDevice action");

        RestService.suspendDevice(device.device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {

                device.account_status = "suspended";

                if (response.data.status) {
                    dispatch({
                        type: SUSPEND_DEVICE,
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

export function activateDevice(device) {

    return (dispatch) => {

        RestService.activateDevice(device.device_id).then((response) => {
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

export function getSimIDs(){
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