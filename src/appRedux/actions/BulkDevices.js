import { BULK_DEVICES_LIST, BULK_SUSPEND_DEVICES, LOADING, INVALID_TOKEN, BULK_LOADING, BULK_ACTIVATE_DEVICES, BULK_HISTORY } from "../../constants/ActionTypes";

import RestService from '../services/RestServices';






export function getBulkDevicesList(data) {
    console.log('at action file ', data)

    return (dispatch) => {
        dispatch({
            type: BULK_LOADING,
            isloading: true
        });
        RestService.getBulkDevicesList(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    console.log('at action file on response')
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

    console.log("bulkSuspendDevice action file =========> ", devices);
    return (dispatch) => {

        RestService.bulkSuspendDevice(devices).then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: BULK_SUSPEND_DEVICES,
                        response: response.data,
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


export function bulkActivateDevice(devices) {

    return (dispatch) => {

        RestService.bulkActivateDevice(devices).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                // device.account_status = '';

                if (response.data.status) {
                    dispatch({
                        type: BULK_ACTIVATE_DEVICES,
                        response: response.data,
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
