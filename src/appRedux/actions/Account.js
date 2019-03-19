import {
    APK_LIST,
    INVALID_TOKEN,
    ADD_APK,
    UNLINK_APK,
    // EDIT_APK,
    LOADING,
    IMPORT_CSV
} from "constants/ActionTypes"

import RestService from '../services/RestServices';

export function importCSV(formData, fieldName) {
    return (dispatch) => {
        // dispatch({
        //     type: LOADING,
        //     isloading: true
        // });
        RestService.importCSV(formData, fieldName).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: IMPORT_CSV,
                    payload: response.data,
                    showMsg: true,
                })
                dispatch({
                    type: IMPORT_CSV,
                    payload: response.data,
                    showMsg: false,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
        // RestService.ApkList()
        //     .then((response) => {
        //         // console.log("apk_list form server");
        //         //  console.log(response.data);
        //         if (RestService.checkAuth(response.data)) {

        //             // dispatch({
        //             //     type: APK_LIST,
        //             //     payload: response.data.list
        //             // });

        //             // dispatch({
        //             //     type: LOADING,
        //             //     isloading: true
        //             // });

        //         } else {
        //             dispatch({
        //                 type: INVALID_TOKEN
        //             });
        //         }
        //     });

    };
}

export function exportCSV(fieldName) {
    return (dispatch) => {
        RestService.exportCSV(fieldName).then((response)=>{
            if(RestService.checkAuth(response.data)){
                if(response.data.status === true){
                    RestService.getFile(response.data.path);
                }
            } else {
                dispatch({
                    type : INVALID_TOKEN
                })
            }
        })
    }
}