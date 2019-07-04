import {
    INVALID_TOKEN, NEW_REQUEST_LIST, REJECT_REQUEST, ACCEPT_REQUEST, USER_CREDITS
} from "../../constants/ActionTypes"

import RestService from '../services/RestServices';

export function getNewCashRequests() {

    return (dispatch) => {

        RestService.getNewCashRequests().then((response) => {
            //  console.log("data form server");
            //  console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: NEW_REQUEST_LIST,
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
export function getUserCredit() {

    return (dispatch) => {

        RestService.getUserCredit().then((response) => {
            //  console.log("data form server");
            //  console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: USER_CREDITS,
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
export function rejectRequest(request) {
    return (dispatch) => {
        // console.log(request)
        RestService.rejectRequest(request).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: REJECT_REQUEST,
                    response: response.data,
                    request: request,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}
export function acceptRequest(request) {
    return (dispatch) => {
        // console.log(device)
        RestService.acceptRequest(request).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: ACCEPT_REQUEST,
                    response: response.data,
                    request: request,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}