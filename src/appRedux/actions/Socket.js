import {
    FINISHED_PUSH_APPS
} from "../../constants/ActionTypes";

import {
    ACK_FINISHED_PUSH_APPS,
} from "../../constants/SocketConstants";

export const getNotification = (socket) => {
    return (dispatch) => {
        socket.on('getNotification', (data) => {
            // dispatch(
            //     action: 
            // )
        })
    }
}

export const ackFinishedPushApps = (socket, deviceId) => {
    return (dispatch) => {

        socket.on(ACK_FINISHED_PUSH_APPS + deviceId, (response) => {
            dispatch({
                type: FINISHED_PUSH_APPS,
                payload: true
            })
        })
    }
}