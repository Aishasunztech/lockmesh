import {
    SAVE_USERS,
    LOAD_USER,
    INVALID_TOKEN,
    USERS_LIST,
    LOADING,
    EDIT_USERS
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function getUserList() {
    return (dispatch) => {
        RestService.userList().then((response) => {
            // console.log("data form server");
            // console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data)
                if (response.data.status) {
                    dispatch({
                        type: USERS_LIST,
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

export function addUser(user) {
    // console.log("action called", data);
    return (dispatch) => {

        dispatch({
            type: LOAD_USER,
        });

        RestService.addUser(user).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('action done ', response.data);
                dispatch({
                    type: SAVE_USERS,
                    response: response.data,
                    payload: {
                        userData: user,
                        msg: response.data.msg
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}
export function editUser(user) {
    // console.log("action called", data);
    return (dispatch) => {

        dispatch({
            type: LOAD_USER,
        });

        RestService.editUser(user).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('action done ', response.data);
                dispatch({
                    type: EDIT_USERS,
                    response: response.data,
                    payload: {
                        userData: user,
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}