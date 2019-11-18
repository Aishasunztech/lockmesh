import {
    INVALID_TOKEN,

} from "constants/ActionTypes"
// import { message } from 'antd';

import RestService from '../services/RestServices';


export function getDealerDetails(dealerId) {
    return (dispatch) => {
        // dispatch({
        //     type: SPIN_lOADING,
        //     spinloading: true
        // });

        RestService.getDealerDetails().then((response) => {

            if (RestService.checkAuth(response.data)) {

                // dispatch({
                //     type: DEALERS_LIST,
                //     payload: response.data
                // });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}