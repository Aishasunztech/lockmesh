import {
    GET_POLICIES,
    INVALID_TOKEN,
    HANDLE_CHECK_APP_POLICY,
    GET_APPS_PERMISSIONS,
    HANDLE_CHECK_SYSTEM_PERMISSIONS,
    SAVE_POLICY,
    PERMSSION_SAVED,
    HANDLE_CHECK_ALL_APP_POLICY,
    HANDLE_POLICY_STATUS,
    EDIT_POLICY,
    POLICY_PERMSSION_SAVED,
    SAVE_POLICY_CHANGES,
    CHECK_HANDLE_ALL_POLICY,
    DEFAULT_POLICY_CHANGE
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function getPolicies() {
    return (dispatch) => {
        RestService.getPolicies().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_POLICIES,
                    payload: response.data.policies
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }

}

export function getAppPermissions(device_id) {
    return (dispatch) => {
        RestService.getAppPermissions(device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_APPS_PERMISSIONS,
                        payload: response.data
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function getDefaultApps() {
    return (dispatch) => {
        RestService.getDefaultApps().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log("hello", response.data);

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function handleChekSystemPermission(e, key) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_SYSTEM_PERMISSIONS,
            payload: {
                value: e,
                key: key,

            }
        })
    }
}

export function savePolicy(data) {

    // console.log('device', device);
    return (dispatch) => {
        RestService.savePolicy(data).then((response) => {
            //  console.log('conect device method call', data);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                if (response.data) {
                    dispatch({
                        type: SAVE_POLICY,
                        response: response.data,
                        payload: {
                            msg: response.data.msg,
                        }
                    });
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }

}

export function handleCheckAppPolicy(e, key, app_id, stateToUpdate, uniqueName = '') {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_APP_POLICY,
            payload: {
                value: e,
                key: key,
                app_id: app_id,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName
            }
        })
    }
}

export function handlePolicyStatus(e, key, id) {
    let data = { value: e, key: key, id: id }
    return (dispatch) => {
        RestService.deleteORStatusPolicy(data).then((response) => {
            //  console.log('conect device method call', data);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                if (response.data.status) {
                    dispatch({
                        type: HANDLE_POLICY_STATUS,
                        payload: {
                            value: e,
                            key: key,
                            id: id,
                        }
                    })
                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    });
                }
            }
        })
    }
}


export function SavePolicyChanges(record) {
    return (dispatch) => {
        RestService.SavePolicyChanges(record).then((response) => {
            //  console.log('conect device method call', data);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                if (response.data.status) {
                    dispatch({
                        type: SAVE_POLICY_CHANGES,
                        payload: {
                            response: response.data
                        }
                    })
                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    });
                }
            }
        })
    }
}


export function handleEditPolicy(e, key, id, stateToUpdate = '', rowId, uniqueName = '') {
    //  console.log('action called', e , key, id, stateToUpdate, uniqueName)
    return (dispatch) => {
        dispatch({
            type: EDIT_POLICY,
            payload: {
                value: e,
                key: key,
                id: id,
                rowId: rowId,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName
            }
        })
    }
}






export function handleCheckAllAppPolicy(e, key, stateToUpdate, uniqueName = '') {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_ALL_APP_POLICY,
            payload: {
                value: e,
                key: key,
                // app_id: app_id,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName
            }
        })
    }
}

export function handleCheckAll(e, key, stateToUpdate, uniqueName = '', rowId) {
    return (dispatch) => {
        dispatch({
            type: CHECK_HANDLE_ALL_POLICY,
            payload: {
                value: e,
                key: key,
                // app_id: app_id,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName,
                rowId: rowId
            }
        })
    }
}

export function savePermission(policy_id, dealers, action) {
    // alert(policy_id);

    return (dispatch) => {
        RestService.savePolicyPermissions(policy_id, dealers, action).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: POLICY_PERMSSION_SAVED,
                    payload: response.data.msg,
                    permission_count: response.data.permission_count,
                    policy_id: policy_id,
                    dealers: dealers
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }

}
export function defaultPolicyChange(enable, policy_id) {
    return (dispatch) => {
        RestService.defaultPolicyChange(enable, policy_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DEFAULT_POLICY_CHANGE,
                    payload: response.data.msg,
                    policy_id: policy_id
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }

}