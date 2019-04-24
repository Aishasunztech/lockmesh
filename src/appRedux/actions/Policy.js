import {
    GET_POLICIES,
    INVALID_TOKEN,
    HANDLE_CHECK_APP_POLICY
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


export function handleCheckAppPolicy(e, key, app_id) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_APP_POLICY,
            payload: {
                value: e,
                key: key,
                app_id: app_id
            }
        })
    }
}