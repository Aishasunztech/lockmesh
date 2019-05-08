import {
	FINISHED_PUSH_APPS
} from "../../constants/ActionTypes";

import {
	ACK_FINISHED_PUSH_APPS,
} from "../../constants/SocketConstants";

export const getNotification = (socket) => {
    return (dispatch) => {
        socket.on('getNotification',(data)=>{
            // dispatch(
            //     action: 
            // )
        })
    }
}

export const ackFinishedPushApps = (socket, deviceId) => {
    return (dispatch) => {
        console.log("socket var",socket);
        socket.on(ACK_FINISHED_PUSH_APPS + deviceId, (response)=>{
            console.log(FINISHED_PUSH_APPS, response);

            dispatch({
                type : FINISHED_PUSH_APPS,
                payload: true
            })
        })
    }
}