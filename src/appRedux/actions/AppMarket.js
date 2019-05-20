import {
    TRANSFER_APPS,
    INVALID_TOKEN,
    GET_MARKET_APPS,
    LOADING

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
