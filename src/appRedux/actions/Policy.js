import {
    GET_POLICIES,
    INVALID_TOKEN,
    HANDLE_CHECK_APP_POLICY,
    GET_APPS_PERMISSIONS,
    HANDLE_CHECK_SYSTEM_PERMISSIONS,
    SAVE_POLICY
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function getPolicies() {
    return (dispatch) => {
        RestService.getPolicies().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_POLICIES,
                    payload: response.data.policies
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
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

export function getDefaultApps() {
    return (dispatch) => {
        RestService.getDefaultApps().then((response) => {
            if(RestService.checkAuth(response.data)) {
                // console.log("hello", response.data);
                
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function handleChekSystemPermission(e, key) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_SYSTEM_PERMISSIONS,
            payload: {
                value: e,
                key: key,
             
            }
        })
    }
}

export function savePolicy(data) {

    // console.log('device', device);
    return (dispatch) => {
        RestService.savePolicy(data).then((response) => {
             console.log('conect device method call', data);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                if (response.data.status) {
                    dispatch({
                        type: SAVE_POLICY,
                        response: response.data,
                        payload: {
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

export function handleCheckAppPolicy(e, key, app_id, stateToUpdate, uniqueName='') {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_APP_POLICY,
            payload: {
                value: e,
                key: key,
                app_id: app_id,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName
            }
        })
    }
}