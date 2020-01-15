import {
    INVALID_TOKEN,
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function getStandaloneSimsList() {
    return (dispatch) => {
        RestService.getStandaloneSimsList().then((response) => {
            // console.log("data form server");
            // console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data)
                if (response.data.status) {
                    dispatch({
                        type: "STAND_ALONE_LIST",
                        payload: response.data.data,
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