import {
    FINISHED_PUSH_APPS,
    FINISHED_PULL_APPS,
    IN_PROCESS,
    FINISHED_POLICY,
    FINISHED_POLICY_STEP,
    FINISHED_IMEI,
    SINGLE_APP_PUSHED,
    GET_APP_JOBS,
    SINGLE_APP_PULLED,
    RECEIVE_SIM_DATA,
    FINISHED_WIPE,
    DEVICE_SYNCED
} from "../../constants/ActionTypes";

import {
    SEND_ONLINE_OFFLINE_STATUS,
    ACK_FINISHED_PUSH_APPS,
    ACK_FINISHED_PULL_APPS,
    ACTION_IN_PROCESS,
    FINISH_POLICY,
    FINISH_IMEI,
    ACK_SINGLE_PUSH_APP,
    ACK_SINGLE_PULL_APP,
    FINISH_POLICY_STEP,
    RECV_SIM_DATA,
    CONNECT_SOCKET,
    DISCONNECT_SOCKET,
    ACK_SETTING_APPLIED,
    ACK_INSTALLED_APPS,
    ACK_UNINSTALLED_APPS,
    FINISH_WIPE
} from "../../constants/SocketConstants";

import RestService from '../services/RestServices'

export const connectSocket = () => {
    return (dispatch) => {
        let socket = RestService.connectSocket();
        dispatch({
            type: CONNECT_SOCKET,
            payload: socket
        })
        // CONNECT_SOCKET
    }
}

export const getNotification = (socket) => {
    return (dispatch) => {
        if (socket) {
            socket.on('getNotification', (data) => {
                // dispatch(
                //     action: 
                // )
            })
        } else {

        }
    }
}

export const sendOnlineOfflineStatus = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(SEND_ONLINE_OFFLINE_STATUS + deviceId, (response) => {
            dispatch({
                type: SEND_ONLINE_OFFLINE_STATUS,
                payload: response.status
            })
        })
    }
}
export const deviceSynced = (socket, deviceId) => {
    return (dispatch) => {
        socket.on("device_synced_" + deviceId, (response) => {
            dispatch({
                type: DEVICE_SYNCED,
                payload: response.status
            })
        })
    }
}

export const ackSettingApplied = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACK_SETTING_APPLIED + deviceId, (response) => {
            dispatch({
                type: ACK_SETTING_APPLIED,
                payload: response
            })
        })
    }
}

export const ackSinglePushApp = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(ACK_SINGLE_PUSH_APP + deviceId, (response) => {
                // console.log("SOCKET WEB SINGLE");
                dispatch({
                    type: SINGLE_APP_PUSHED,
                    payload: response
                })
            })
        } else {

        }
    }
}

export const ackInstalledApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(ACK_INSTALLED_APPS + deviceId, (response) => {
                console.log("ackInstalledApps", response);
                dispatch({
                    type: ACK_INSTALLED_APPS,
                    payload: response
                })
            })
        } else {

        }
    }
}

export const ackUninstalledApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(ACK_UNINSTALLED_APPS + deviceId, (response) => {
                console.log("ackUninstalledApps", response);
                dispatch({
                    type: ACK_UNINSTALLED_APPS,
                    payload: response
                })
            })
        } else {

        }
    }
}

export const ackFinishedPushApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(ACK_FINISHED_PUSH_APPS + deviceId, (response) => {
                // console.log("jkshdksa");
                dispatch({
                    type: FINISHED_PUSH_APPS,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const ackSinglePullApp = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(ACK_SINGLE_PULL_APP + deviceId, (response) => {
                // console.log("SOCKET WEB SINGLE");
                dispatch({
                    type: SINGLE_APP_PULLED,
                    payload: response
                })
            })
        } else {

        }

    }
}

export const ackFinishedPullApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(ACK_FINISHED_PULL_APPS + deviceId, (response) => {
                dispatch({
                    type: FINISHED_PULL_APPS,
                    payload: true
                })
            })

        } else {

        }
    }
}

export const actionInProcess = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(ACTION_IN_PROCESS + deviceId, (response) => {
                dispatch({
                    type: IN_PROCESS,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const ackFinishedWipe = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            console.log("Socket connected wipe device function ");
            socket.on(FINISH_WIPE + deviceId, (response) => {
                dispatch({
                    type: FINISHED_WIPE,
                    payload: true
                })
            })
        } else {

        }
    }
}
export const ackFinishedPolicy = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(FINISH_POLICY + deviceId, (response) => {
                dispatch({
                    type: FINISHED_POLICY,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const ackFinishedPolicyStep = (socket, deviceId) => {
    // console.log("ssad");
    return (dispatch) => {
        if (socket) {
            socket.on(FINISH_POLICY_STEP + deviceId, (response) => {
                dispatch({
                    type: FINISHED_POLICY_STEP,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const ackImeiChanged = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            socket.on(FINISH_IMEI + deviceId, (response) => {
                dispatch({
                    type: FINISHED_IMEI,
                    payload: true
                })
            })
        } else {

        }
    }
}


// sim button
export const receiveSim = (socket, deviceId) => {
    // console.log("1: RECEIVE_SIM_DATA fro mobile at client side");
    return (dispatch) => {
        if (socket) {
            socket.on(RECV_SIM_DATA + deviceId, (response) => {
                console.log("2: RECEIVE_SIM_DATA fro mobile at client side", response);
                dispatch({
                    type: RECEIVE_SIM_DATA,
                    payload: response,
                })
            })
        } else {

        }
    }
}

export const hello_web = (socket) => {


    return (dispatch) => {
        if (socket) {
            // socket.emit('join', 'testRoom');
            socket.on('hello_web', function () {
                console.log("hello world");
            })

        } else {

        }
    }
}

export const closeSocketEvents = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            // push apps
            socket.off(ACK_FINISHED_PUSH_APPS + deviceId);
            socket.off(ACK_SINGLE_PUSH_APP + deviceId)

            // pull apps
            socket.off(ACK_FINISHED_PULL_APPS + deviceId);
            socket.off(ACK_SINGLE_PULL_APP + deviceId);

            // policy
            socket.off(FINISH_POLICY + deviceId)
            socket.off(FINISH_POLICY_STEP + deviceId)
            socket.off(ACTION_IN_PROCESS + deviceId)

            // imei
            socket.off(FINISH_IMEI + deviceId);

            // sim data
            socket.off(RECV_SIM_DATA + deviceId);

            // test
            socket.off('hello_web');
            socket.disconnect();
        } else {

        }
        dispatch({
            type: DISCONNECT_SOCKET,
            payload: null
        });

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
