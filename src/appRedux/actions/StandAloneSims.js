import {
    INVALID_TOKEN, STAND_ALONE_LIST,
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
                        type: STAND_ALONE_LIST,
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

export function changeSimStatus(id, type) {
    return (dispatch) => {
        RestService.changeSimStatus(id, type).then((response) => {
            // console.log("data form server");
            // console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data)
                if (response.data.status) {
                    dispatch({
                        type: STAND_ALONE_LIST,
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