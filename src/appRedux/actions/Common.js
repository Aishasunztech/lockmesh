import {
    GET_DROPDOWN,
    POST_DROPDOWN,
    INVALID_TOKEN
} from "constants/ActionTypes"
// import AuthFailed from './Auth';

import RestService from '../services/RestServices';

export function getDropdown(pageName) {
    
    return (dispatch) => {
        RestService.getSelectedItems(pageName)
            .then((response) => {
            // console.log("apk_list form server");
            //  console.log(response.data);
            if (RestService.checkAuth(response.data)) {
               //  console.log("action selected options", JSON.parse(response.data.data));

                dispatch({
                    type: GET_DROPDOWN,
                    payload: JSON.parse(response.data.data)
                });


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}

export function postDropdown(selectedItems, pageName){
    return (dispatch) =>{
        RestService.postSelectedItems(selectedItems, pageName).then((response)=>{
            if(RestService.checkAuth(response.data)){
                // if(response.data.status === true)
                dispatch({
                    type: POST_DROPDOWN,
                    payload: response.data.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}