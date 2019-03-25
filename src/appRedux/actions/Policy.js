import {
    GET_POLICIES,
    INVALID_TOKEN
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function getPolicies() {
    return (dispatch) => {
        RestService.getDeviceProfiles().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_POLICIES,
                    payload: response.data.profiles[0]
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
                console.log("hello", response.data);
                
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}