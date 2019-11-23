import {
    INVALID_TOKEN,
    DEALER_DETAILS,
    DEALER_PAYMENT_HISTORY,
    DEALER_SALES_HISTORY
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

export function getDealerPaymentHistory(dealerId){
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

export function getDealerSalesHistory(dealerId){
    return (dispatch) => {
        RestService.getDealerSalesHistory(dealerId).then((response) => {

            if (RestService.checkAuth(response.data)) {
                console.log(response.data)
                dispatch({
                    type: DEALER_SALES_HISTORY,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}