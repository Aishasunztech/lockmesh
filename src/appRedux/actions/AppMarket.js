import {
    TRANSFER_APPS,
    INVALID_TOKEN,
    GET_MARKET_APPS,
    LOADING,
    UNINSTALL_PERMISSION_CHANGED

} from "../../constants/ActionTypes"
// import AuthFailed from './Auth';

import RestService from '../services/RestServices';

export function transferApps(data) {
    return (dispatch) => {
        dispatch({
            type: LOADING
        })
        // console.log(data);
        RestService.transferApps(data).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: TRANSFER_APPS,
                    msg: response.data.msg,
                    payload: response.data.data,
                    status: response.data.status
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}
export function getMarketApps() {
    return (dispatch) => {
        RestService.getMarketApps().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_MARKET_APPS,
                    payload: response.data.data,
                    status: response.data.status
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}
export function handleUninstall(apk_id, value) {
    return (dispatch) => {
        RestService.handleUninstall(apk_id, value).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: UNINSTALL_PERMISSION_CHANGED,
                    msg: response.data.msg,
                    payload: response.data.data,
                    status: response.data.status
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}
