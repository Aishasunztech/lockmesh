import {
    INVALID_TOKEN,
    DEALER_DETAILS
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