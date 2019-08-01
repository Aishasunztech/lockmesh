import {
    AGENT_LIST,
    SAVE_AGENT,
    LOAD_USER,
    INVALID_TOKEN,
    LOADING,
    UPDATE_AGENT,
    DELETE_USER,
    UNDO_DELETE_USER
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function getAgentList() {
    
    return (dispatch) => {
        
        RestService.getAgentList().then((response) => {
            
            if (RestService.checkAuth(response.data)) {
                
                dispatch({
                    type: AGENT_LIST,
                    payload: response.data,
                });
                
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}

export function addAgent(agent) {
    
    return (dispatch) => {
    
        RestService.addAgent(agent).then((response) => {
            if (RestService.checkAuth(response.data)) {
                
                dispatch({
                    type: SAVE_AGENT,
                    payload: response.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export function updateAgent(agent) {
    return (dispatch) => {
        RestService.updateAgent(agent).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: UPDATE_AGENT,
                    payload: {
                        status: response.data.status,
                        agent: agent,
                        msg: response.data.msg
                    },
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export function deleteAgent(userId) {
    // return (dispatch) => {

    //     RestService.deleteUser(userId).then((response) => {
    //         if (RestService.checkAuth(response.data)) {
    //             // console.log('action done ', response.data);
    //             dispatch({
    //                 type: DELETE_USER,
    //                 payload: {
    //                     status: response.data.status,
    //                     msg: response.data.msg,
    //                     user_id: userId
    //                 }
    //             });

    //         } else {
    //             dispatch({
    //                 type: INVALID_TOKEN
    //             })
    //         }
    //     })
    // }
}

// export function undoDeleteUser(userId) {
//     return (dispatch) => {

//         RestService.undoDeleteUser(userId).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 // console.log('action done ', response.data);
//                 dispatch({
//                     type: UNDO_DELETE_USER,
//                     payload: {
//                         status: response.data.status,
//                         msg: response.data.msg,
//                         user_id: userId
//                     }
//                 });

//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 })
//             }
//         })
//     }
// }