import {
    INVALID_TOKEN,
    DEALER_DETAILS,
    DEALER_PAYMENT_HISTORY,
    SET_DEALER_LIMIT
} from "../../constants/ActionTypes"
// import { message } from 'antd';

import RestService from '../services/RestServices';


export function getDealerDetails(dealerId) {
    return (dispatch) => {
        // dispatch({
        //     type: SPIN_lOADING,
        //     spinloading: true
        // });

        RestService.getDealerDetails(dealerId).then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: DEALER_DETAILS,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}

export function getDealerPaymentHistory(dealerId) {
    return (dispatch) => {
        RestService.getDealerPaymentHistory(dealerId).then((response) => {

            if (RestService.checkAuth(response.data)) {
                console.log(response.data)
                dispatch({
                    type: DEALER_PAYMENT_HISTORY,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    }
}

export function setCreditLimit(data) {
    return (dispatch) => {
        RestService.setCreditLimit(data).then((response) => {

            if (RestService.checkAuth(response.data)) {
                console.log(response.data)
                dispatch({
                    type: SET_DEALER_LIMIT,
                    payload: response.data,
                    formData: data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    }
}