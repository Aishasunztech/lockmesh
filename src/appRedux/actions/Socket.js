import {
    FINISHED_PUSH_APPS,
    FINISHED_PULL_APPS,
    IN_PROCESS,
    FINISHED_POLICY,
    FINISHED_POLICY_STEP,
    FINISHED_IMEI,
    SINGLE_APP_PUSHED,
    GET_APP_JOBS,
    SINGLE_APP_PULLED
} from "../../constants/ActionTypes";

import {
    ACK_FINISHED_PUSH_APPS,
    ACK_FINISHED_PULL_APPS,
    ACTION_IN_PROCESS,
    FINISH_POLICY,
    FINISH_IMEI,
    ACK_SINGLE_PUSH_APP,
    ACK_SINGLE_PULL_APP,
    FINISH_POLICY_STEP
} from "../../constants/SocketConstants";

import RestService from '../services/RestServices'

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
            // console.log("jkshdksa");
            dispatch({
                type: FINISHED_PUSH_APPS,
                payload: true
            })
        })
    }
}
export const ackSinglePushApp = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACK_SINGLE_PUSH_APP + deviceId, (response) => {
            // console.log("SOCKET WEB SINGLE");
            dispatch({
                type: SINGLE_APP_PUSHED,
                payload: response
            })
        })
    }
}
export const ackSinglePullApp = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACK_SINGLE_PULL_APP + deviceId, (response) => {
            // console.log("SOCKET WEB SINGLE");
            dispatch({
                type: SINGLE_APP_PULLED,
                payload: response
            })
        })
    }
}

export const ackFinishedPullApps = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACK_FINISHED_PULL_APPS + deviceId, (response) => {
            dispatch({
                type: FINISHED_PULL_APPS,
                payload: true
            })
        })
    }
}

export const actionInProcess = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACTION_IN_PROCESS + deviceId, (response) => {
            dispatch({
                type: IN_PROCESS,
                payload: true
            })
        })
    }
}
export const ackFinishedPolicy = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(FINISH_POLICY + deviceId, (response) => {
            dispatch({
                type: FINISHED_POLICY,
                payload: true
            })
        })
    }
}
export const ackFinishedPolicyStep = (socket, deviceId) => {
    // console.log("ssad");
    return (dispatch) => {
        socket.on(FINISH_POLICY_STEP + deviceId, (response) => {
            dispatch({
                type: FINISHED_POLICY_STEP,
                payload: true
            })
        })
    }
}
export const ackImeiChanged = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(FINISH_IMEI + deviceId, (response) => {
            dispatch({
                type: FINISHED_IMEI,
                payload: true
            })
        })
    }
}
export function getAppJobQueue(deviceId) {
    return (dispatch) => {
        RestService.getAppJobQueue(deviceId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data) {
                    dispatch({
                        type: GET_APP_JOBS,
                        payload: response.data.data,
                        data_type: response.data.type
                    })
                }

            }
        });

    };
}