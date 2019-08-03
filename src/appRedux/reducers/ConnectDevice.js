import React, { Fragment } from 'react'
import {
    GET_DEVICE_DETAILS,
    GET_DEVICE_APPS,
    GET_PROFILES,
    GET_DEVICE_HISTORIES,
    PUSH_APPS,
    UNDO_APPS,
    REDO_APPS,
    SETTINGS_APPLIED,
    START_LOADING,
    END_LOADING,
    SHOW_MESSAGE,
    LOAD_PROFILE,
    SHOW_HISTORY_MODAL,
    UNLINK_DEVICE,
    CHANGE_PAGE,
    GUEST_PASSWORD,
    ENCRYPTED_PASSWORD,
    DURESS_PASSWORD,
    ADMIN_PASSWORD,
    SHOW_SAVE_PROFILE_MODAL,
    // HANDLE_PROFILE_INPUT,
    POLICY,
    PROFILE,
    ACTIVATE_DEVICE2,
    SUSPEND_DEVICE2,
    HANDLE_CHECK_APP,
    HANDLE_CHECK_ALL,
    GET_USER_ACC_ID,
    GET_POLICIES,
    FLAG_DEVICE,
    UNFLAG_DEVICE,
    WIPE_DEVICE,
    CHECKPASS,
    GET_DEALER_APPS,
    HANDLE_CHECK_EXTENSION,
    HANDLE_CHECK_ALL_EXTENSION,
    UNDO_EXTENSIONS,
    REDO_EXTENSIONS,
    HANDLE_CHECK_CONTROL,
    UNDO_CONTROLS,
    REDO_CONTROLS,
    GET_APPS_PERMISSIONS,
    HANDLE_CHECK_MAIN_SETTINGS,
    GET_IMIE_HISTORY,
    SHOW_PUSH_APPS_MODAL,
    SHOW_PULL_APPS_MODAL,
    PULL_APPS,
    WRITE_IMEI,
    GET_ACTIVITIES,
    HIDE_POLICY_CONFIRM,
    APPLY_POLICY,
    CLEAR_APPLICATIONS,
    SAVE_PROFILE,
    EDIT_DEVICE,
    CLEAR_STATE,
    DEVICE_SYNCED,
    ADD_SIM_REGISTER,
    GET_SIMS,
    UPDATE_SIM,
    RECEIVE_SIM_DATA,
    DELETE_SIM,
    SIM_HISTORY,
    TRANSFER_DEVICE
} from "../../constants/ActionTypes";

import {
    NOT_AVAILABLE, MAIN_MENU, WARNNING, PROCEED_WITH_WIPING_THE_DEVICE,
} from '../../constants/Constants';

import { message, Modal, Alert, Icon } from 'antd';
// import { Button_Cancel } from '../../constants/ButtonConstants';
// import { convertToLang } from '../../routes/utils/commonUtils';
// import { WIPE_DEVICE_DESCRIPTION } from '../../constants/DeviceConstants';

const warning = Modal.warning;
const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error

const actions = require("../../appRedux/actions/ConnectDevice")

const initialState = {
    isLoading: false,
    forceUpdate: 0,
    messageText: '',
    messageType: '',
    showMessage: false,

    pageName: MAIN_MENU,
    status: '',
    appPermissions: [],

    isSaveProfileBtn: false,
    syncStatus: false,
    device: {},
    allExtensions: [],

    wipeDevice: {},
    wipeDeviceID: '',
    wipeDevieStatus: '',

    checked_app_id: {},
    app_list: [],
    undoApps: [],
    redoApps: [],

    guestAll: false,
    encryptedAll: false,
    enableAll: false,

    applyBtn: false,
    undoBtn: false,
    redoBtn: false,
    clearBtn: false,

    profiles: [],
    policies: [],

    historyModal: false,
    device_histories: [],

    saveProfileModal: false,
    historyType: "history",
    saveProfileType: '',
    profileName: '',
    policyName: '',

    pwdType: '',

    isGuestPwd: false,
    isAdminPwd: false,
    isEncryptedPwd: false,
    isDuressPwd: false,

    guestPwd: '',
    guestCPwd: '',

    adminPwd: '',
    adminCPwd: '',

    encryptedPwd: '',
    encryptedCPwd: '',

    duressPwd: '',
    duressCPwd: '',

    apk_list: [],
    apk_list_dump: [],

    extensions: [],
    secureSettingsMain: [],

    undoExtensions: [],
    redoExtensions: [],
    controls: {},
    changedCtrls: {},
    undoControls: [],
    redoControls: [],
    activities: [],

    guestAllExt: false,
    encryptedAllExt: false,

    imei_list: [],
    pushAppsModal: false,
    pullAppsModal: false,
    applyPolicyConfirm: false,
    device_found: true,
    noOfApp_push_pull: 0,
    noOfApp_pushed_pulled: 0,
    is_push_apps: 0,
    is_policy_process: 0,
    reSync: false,

    // sim module
    sim_list: [],
    guestSimAll: 0,
    encryptSimAll: 0,
    unrGuest: 0,
    unrEncrypt: 0,
    simUpdated: false,
    simDeleted: false,
    simHistoryList: [],

};

export default (state = initialState, action) => {

    switch (action.type) {

        case CHANGE_PAGE: {

            return {
                ...state,
                pageName: action.payload
            }
        }
        case CLEAR_STATE: {
            // console.log("CLEAR STATE FUNCTION");
            return {
                ...state,
                is_push_apps: 0,
                is_policy_process: 0,
                noOfApp_push_pull: 0,
                noOfApp_pushed_pulled: 0,
            }
        }
        case GET_DEVICE_DETAILS: {
            let device = action.payload;
            // console.log(device);
            if (device) {
                if (device.account_status === "suspended" || device.status === "expired" || device.unlink_status === 1) {
                    let status = null;

                    if (device.status === "expired") {
                        status = "Expired"
                    } else if (device.account_status === "suspended") {
                        status = "Suspended";
                    } else if (device.unlink_status === 1) {
                        status = "Unlinked"
                    }

                    return {
                        ...state,
                        device: action.payload,
                        applyBtn: false,
                        undoBtn: false,
                        redoBtn: false,
                        clearBtn: false,
                        pageName: NOT_AVAILABLE,
                        status: status,
                        device_found: true,
                    }
                } else {
                    return {
                        ...state,
                        device: action.payload,
                        device_found: true,
                    }
                }
            } else {
                return { ...state, device_found: false }
            }

        }
        case SUSPEND_DEVICE2: {
            if (action.response.status) {

                state.device = action.response.data;
                state.device.account_status = 'suspended';

                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });

            }
            // let device = state.device;
            return {
                ...state,
                isloading: false,
                pageName: NOT_AVAILABLE
            }

        }

        case FLAG_DEVICE: {

            if (action.response.status) {

                state.device = action.response.data;
                state.pageName = NOT_AVAILABLE;
                state.status = 'Suspended';
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });

            }
            return {
                ...state,
                isloading: false,
            }
        }

        case UNFLAG_DEVICE: {
            // console.log(action.response.msg);
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });

            }
            // console.log('action done ', state.device)
            return {
                ...state,
                isloading: false,
            }
        }
        case WIPE_DEVICE: {
            // console.log(action.response.msg);
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });

            }
            // console.log('action done ', state.device)
            return {
                ...state,
                isloading: false,
            }
        }
        case GET_DEVICE_APPS: {
            state.undoApps.push(JSON.parse(JSON.stringify(action.payload)));
            state.undoExtensions.push(JSON.parse(JSON.stringify(action.extensions)));
            state.undoControls.push(JSON.parse(JSON.stringify(action.controls)));
            //  console.log('controls form reduvcer of getdeviceapp', action.controls)
            let applications = action.payload;
            let check = handleCheckedAll(applications);
            return {
                ...state,
                app_list: action.payload,
                extensions: action.extensions,
                controls: action.controls,
                // secureSettingsMain: action.controls.settings,
                isAdminPwd: false,
                isDuressPwd: false,
                isEncryptedPwd: false,
                isGuestPwd: false,
                applyBtn: false,
                ...check
            }
        }

        case EDIT_DEVICE: {
            if (action.response.status) {
                if (action.response.data.length) {
                    state.device = action.response.data[0];
                }

                return {
                    ...state,
                    //   device: state.device
                }


            }
        }


        case GET_PROFILES: {
            return {
                ...state,
                isloading: true,
                profiles: action.payload
            }
        }

        case GET_POLICIES: {
            return {
                ...state,
                isloading: true,
                policies: action.payload
            }
        }

        case GET_ACTIVITIES: {
            return {
                ...state,
                activities: action.payload.data
            }
        }

        case GET_USER_ACC_ID: {

            return {
                ...state,
                isloading: true,
                user_acc_id: action.response.user_acount_id
            }
        }
        case GET_DEVICE_HISTORIES: {

            // console.log(GET_PROFILES);
            // console.log({
            //     ...state,
            //     isloading: true,
            //     device_histories: action.payload
            // });
            return {
                ...state,
                isloading: true,
                device_histories: action.payload
            }
        }
        case PUSH_APPS: {
            let noOfApps = 0
            if (action.payload.status) {
                if (action.payload.online) {
                    success({
                        title: action.payload.msg, // "Apps are Being pushed"
                    });
                } else {
                    // message.warning(<Fragment><span>Warning Device Offline</span> <div>Apps pushed to device. </div> <div>Action will be performed when device is back online</div></Fragment>)
                    warning({
                        title: action.payload.msg, //  'Warning Device Offline',
                        content: action.payload.content // "Apps pushed to device. Action will be performed when device is back online", // 'Apps pushed to device. Action will be performed when device is back online',
                    });
                }
                noOfApps = action.payload.noOfApps
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                noOfApp_push_pull: noOfApps
            }
        }
        case APPLY_POLICY: {
            if (action.payload.status) {
                if (action.payload.online) {
                    success({
                        title: action.payload.msg, // "Policy is Being applied",
                    });

                } else {
                    // message.warning(<Fragment><span>Warning Device Offline</span> <div>Apps pushed to device. </div> <div>Action will be performed when device is back online</div></Fragment>)
                    warning({
                        title: action.payload.msg, // 'Warning Device Offline',
                        content: action.payload.content // 'Policy Applied to device. Action will be performed when device is back online',
                    });
                }
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                is_policy_process: 1,
                applyPolicyConfirm: false
            }
        }

        case LOAD_PROFILE: {
            // console.log(LOAD_PROFILE);
            state.undoApps.push(action.payload);
            let check = handleCheckedAll(action.payload);
            return {
                ...state,
                app_list: action.payload,
                ...check
            }
        }
        case SETTINGS_APPLIED: {

            if (action.payload.status) {
                if (action.payload.online) {
                    success({
                        title: action.payload.msg,
                    });

                } else {
                    // message.warning(<Fragment><span>Warning Device Offline</span> <div>Apps pushed to device. </div> <div>Action will be performed when device is back online</div></Fragment>)
                    warning({
                        title: 'Warning Device Offline',
                        content: action.payload.msg,
                    });
                }
            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                changedCtrls: {},
                pageName: MAIN_MENU,
                showMessage: false,
                applyBtn: false,
                undoBtn: false,
                redoBtn: false,
                clearBtn: false
            }
        }
        case START_LOADING: {
            return {
                ...state,
                isLoading: true
            }
        }

        case SHOW_HISTORY_MODAL: {
            // console.log(SHOW_HISTORY_MODAL);
            // console.log({
            //     ...state,SHOW_HISTORY_MODAL
            //     historyType: action.payload.ProfileType,
            //     historyModal: action.payload.visible
            // })
            // console.log(action.payload.profileType, action.payload.visible, 'ok')
            return {
                ...state,
                historyType: action.payload.profileType,
                historyModal: action.payload.visible
            }
        }

        case END_LOADING: {

            return {
                ...state,
                isLoading: false
            }
        }

        case TRANSFER_DEVICE: {
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                })
            } else {
                error({
                    title: action.payload.msg,
                })
            }

            return {
                ...state,
            }
        }

        case SHOW_MESSAGE: {

            if (action.payload.showMessage) {
                if (action.payload.messageType === 'success') {
                    success({
                        title: action.payload.messageText,
                    })
                } else {
                    error({
                        title: action.payload.messageText,
                    })
                }
            }

            return {
                ...state,
            }
        }

        case ACTIVATE_DEVICE2: {

            //  console.log(state.device, 'active device done', action.payload.device);
            if (action.response.status) {

                state.device = action.response.data;
                state.status = '';
                state.pageName = 'main_menu'
                success({
                    title: action.response.msg,
                });

            } else {
                error({
                    title: action.response.msg,
                });

            }

            // console.log('action done ', state.device)
            return {
                ...state,
                device: state.device,
                isloading: true
            }
        }

        case UNLINK_DEVICE: {
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log('unlink called');
            return {
                ...state,
                isLoading: false,

            }
        }
        case GUEST_PASSWORD: {
            // console.log(GUEST_PASSWORD);
            // console.log(action.payload);
            return {
                ...state,
                guestPwd: action.payload.pwd,
                guestCPwd: action.payload.confirm,
                isGuestPwd: true,
                applyBtn: true
            }
        }

        case ENCRYPTED_PASSWORD: {
            return {
                ...state,
                encryptedPwd: action.payload.pwd,
                encryptedCPwd: action.payload.confirm,
                isEncryptedPwd: true,
                applyBtn: true
            }
        }

        case DURESS_PASSWORD: {
            return {
                ...state,
                duressPwd: action.payload.pwd,
                duressCPwd: action.payload.confirm,
                isDuressPwd: true,
                applyBtn: true
            }
        }

        case ADMIN_PASSWORD: {
            return {
                ...state,
                adminPwd: action.payload.pwd,
                adminCPwd: action.payload.confirm,
                isAdminPwd: true,
                applyBtn: true
            }
        }

        case CHECKPASS: {
            if (action.payload.PasswordMatch.password_matched) {
                // alert(action.payload.actionType);

                if (action.payload.actionType === PUSH_APPS) {
                    return {
                        ...state,
                        pushAppsModal: true
                    }
                } else if (action.payload.actionType === PULL_APPS) {
                    return {
                        ...state,
                        pullAppsModal: true
                    }
                } else if (action.payload.actionType === WIPE_DEVICE) {
                    return {
                        ...state,
                        // wipeDevice: action.payload.device,
                        // msg: "Do you really want to Wipe the device " + action.payload.device.device_id + "?",
                        // wipeDeviceID: action.payload.device.device_id,
                        wipeDevieStatus: new Date()
                    }
                    // showConfirm1(action.payload.device, "Do you really want to Wipe the device " + action.payload.device.device_id + "?")
                }
                else if (action.payload.actionType === POLICY) {
                    return {
                        ...state,
                        historyModal: false,
                        applyPolicyConfirm: true,
                        is_policy_process: 0
                    }
                }
            }
            else {
                error({
                    title: action.payload.PasswordMatch.msg, // "Password Did not Match. Please Try again.",
                });
            }

        }

        case POLICY: {
            return {
                ...state,
                policyName: action.payload
            }
        }

        case PROFILE: {
            return {
                ...state,
                profileName: action.payload
            }
        }

        case SAVE_PROFILE: {
            return {
                ...state,
                isSaveProfileBtn: false,
            }
        }

        case SHOW_SAVE_PROFILE_MODAL: {
            return {
                ...state,
                saveProfileModal: action.payload.visible,
                saveProfileType: action.payload.profileType
            }
        }

        case PULL_APPS: {
            let noOfApps = 0
            if (action.payload.status) {
                if (action.payload.online) {
                    success({
                        title: action.payload.msg, // "Apps are Being pulled",
                    });
                } else {
                    warning({
                        title: action.payload.msg, //  'Warning Device Offline',
                        content: action.payload.content // 'Apps pulled from device. Action will be performed when device is back online',
                    });
                }
                noOfApps = action.payload.noOfApps
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                noOfApp_push_pull: noOfApps
            }
        }


        case GET_APPS_PERMISSIONS: {
            // console.log('data permissions', action.payload)
            return {
                ...state,
                appPermissions: action.payload.appPermissions,
                allExtensions: action.payload.extensions

            }
        }

        case HANDLE_CHECK_CONTROL: {
            let changedControls = JSON.parse(JSON.stringify(state.controls));
            // if (action.payload.key === 'wifi_status') {
            //     changedControls[action.payload.key] = true;
            // } else {
            changedControls.controls[action.payload.key] = action.payload.value;
            state.changedCtrls[action.payload.key] = action.payload.value;
            // }

            state.controls = JSON.parse(JSON.stringify(changedControls));
            let controls = state.controls;
            state.undoControls.push(JSON.parse(JSON.stringify(changedControls)));
            // console.log('reduver aongds', state.controls);

            return {
                ...state,
                controls: state.controls,
                forceUpdate: state.forceUpdate + 1,
                changedCtrls: state.changedCtrls,
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true
            }
        }

        case HANDLE_CHECK_MAIN_SETTINGS: {

            let changedControls = JSON.parse(JSON.stringify(state.controls));
            let objIndex = changedControls.settings.findIndex(item => item.uniqueName === action.payload.main);
            // console.log(action.payload.main,' obj index is', objIndex)
            if (objIndex > -1) {
                changedControls.settings[objIndex][action.payload.key] = action.payload.value;
                // console.log(changedSettings[objIndex], 'app is the ', changedSettings[objIndex][action.payload.key])
            }

            state.controls = JSON.parse(JSON.stringify(changedControls));
            state.undoControls.push(JSON.parse(JSON.stringify(changedControls)));
            // console.log('reduver aongds', state.controls);

            return {
                ...state,
                controls: state.controls,
                applyBtn: true,
                undoBtn: true,
                isSaveProfileBtn: true
            }

        }

        case UNDO_CONTROLS: {

            if (state.undoControls.length > 1) {

                let controls = state.undoControls[state.undoControls.length - 1];
                state.undoControls.pop();

                state.redoControls.push(JSON.parse(JSON.stringify(controls)));

                if (state.undoControls.length === 1) {
                    return {
                        ...state,
                        undoBtn: false,
                        redoBtn: true,
                        controls: JSON.parse(JSON.stringify(state.undoControls[state.undoControls.length - 1]))
                    };
                } else {
                    return {
                        ...state,
                        redoBtn: true,
                        controls: state.undoControls[state.undoControls.length - 1]
                    };
                }
            } else {
                return {
                    ...state,
                    undoBtn: false
                };
            }
        }

        case REDO_CONTROLS: {
            if (state.redoControls.length > 0) {

                let controls = state.redoControls[state.redoControls.length - 1];
                state.redoControls.pop();
                state.undoControls.push(JSON.parse(JSON.stringify(controls)));

                if (state.redoControls.length === 0) {
                    return {
                        ...state,
                        controls: controls,
                        undoBtn: true,
                        redoBtn: false,
                        clearBtn: true
                    };
                } else {
                    return {
                        ...state,
                        controls: controls,
                        undoBtn: true,
                        clearBtn: true
                    };

                }
            } else {
                return {
                    ...state,
                    redoBtn: false
                };
            }
        }

        case HANDLE_CHECK_EXTENSION: {

            let changedExtensions = JSON.parse(JSON.stringify(state.extensions));


            changedExtensions.forEach(extension => {
                if (extension.uniqueName === action.payload.uniqueName) {
                    if (action.payload.app_id === '000') {
                        extension[action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                    } else {
                        let objIndex = extension.subExtension.findIndex((obj => obj.app_id === action.payload.app_id));
                        if (objIndex > -1) {
                            extension.subExtension[objIndex][action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                            extension.subExtension[objIndex].isChanged = true;
                        }
                    }
                }
            });

            state.extensions = JSON.parse(JSON.stringify(changedExtensions));
            let extensions = state.extensions;
            state.undoExtensions.push(JSON.parse(JSON.stringify(changedExtensions)));
            let check = handleCheckedAllExts(extensions);

            return {
                ...state,
                extensions: [...state.extensions],
                checked_app_id: {
                    id: action.payload.app_id,
                    key: action.payload.key,
                    value: action.payload.value
                },
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true,
                ...check
            }
        }

        case HANDLE_CHECK_ALL_EXTENSION: {
            let changedExtensions = JSON.parse(JSON.stringify(state.extensions));
            state[action.payload.keyAll] = action.payload.value;
            changedExtensions.forEach(extension => {
                if (extension.uniqueName === action.payload.uniqueName) {
                    for (let subExt of extension.subExtension) {
                        subExt[action.payload.key] = action.payload.value === true ? 1 : 0;
                        subExt.isChanged = true;
                    }
                }
            });
            state.undoExtensions.push(JSON.parse(JSON.stringify(changedExtensions)));

            return {
                ...state,
                extensions: changedExtensions,
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true,
                // ...check
            }
        }

        case UNDO_EXTENSIONS: {

            if (state.undoExtensions.length > 1) {

                let exten = state.undoExtensions[state.undoExtensions.length - 1];
                state.undoExtensions.pop();

                state.redoExtensions.push(JSON.parse(JSON.stringify(exten)));

                if (state.undoExtensions.length === 1) {
                    return {
                        ...state,
                        undoBtn: false,
                        redoBtn: true,
                        extensions: JSON.parse(JSON.stringify(state.undoExtensions[state.undoExtensions.length - 1]))
                    };
                } else {
                    return {
                        ...state,
                        redoBtn: true,
                        extensions: JSON.parse(JSON.stringify(state.undoExtensions[state.undoExtensions.length - 1]))
                    };
                }
            } else {
                return {
                    ...state,
                    undoBtn: false
                };
            }
        }

        case REDO_EXTENSIONS: {
            if (state.redoExtensions.length > 0) {

                let extensions = state.redoExtensions[state.redoExtensions.length - 1];
                // console.log('if exist ex', extensions)
                state.redoExtensions.pop();
                state.undoExtensions.push(JSON.parse(JSON.stringify(extensions)));

                if (state.redoExtensions.length === 0) {
                    return {
                        ...state,
                        extensions: extensions,
                        undoBtn: true,
                        redoBtn: false,
                        clearBtn: true
                    };
                } else {
                    return {
                        ...state,
                        extensions: extensions,
                        undoBtn: true,
                        clearBtn: true
                    };

                }
            } else {
                return {
                    ...state,
                    redoBtn: false
                };
            }
        }
        case HANDLE_CHECK_APP: {
            let changedApps = JSON.parse(JSON.stringify(state.app_list));
            changedApps.forEach(app => {
                if (app.app_id === action.payload.app_id) {
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                }
            });

            state.app_list = JSON.parse(JSON.stringify(changedApps));
            let applications = state.app_list;
            state.undoApps.push(JSON.parse(JSON.stringify(changedApps)));
            let check = handleCheckedAll(applications);
            return {
                ...state,
                // app_list: changedApps,
                checked_app_id: {
                    id: action.payload.app_id,
                    key: action.payload.key,
                    value: action.payload.value
                },
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true,
                ...check
            }
        }

        case HANDLE_CHECK_ALL: {
            let applications = JSON.parse(JSON.stringify(state.app_list));
            applications.forEach(app => {
                // console.log(app[action.payload.key], 'kkkkkk', 'guest')
                app.isChanged = true;
                if (app.default_app !== 1) {
                    app[action.payload.key] = action.payload.value;
                } else if (app.default_app === 1 && action.payload.key === 'guest') {
                    app[action.payload.key] = action.payload.value;
                }
            })

            state[action.payload.keyAll] = action.payload.value;
            state.undoApps.push(JSON.parse(JSON.stringify(applications)));

            return {
                ...state,
                app_list: applications,
                checked_app_id: {
                    key: action.payload.key,
                    value: action.payload.value,
                },
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true
            }
        }

        case UNDO_APPS: {

            if (state.undoApps.length > 1) {

                let apps = state.undoApps[state.undoApps.length - 1];
                state.undoApps.pop();

                state.redoApps.push(JSON.parse(JSON.stringify(apps)));

                if (state.undoApps.length === 1) {
                    return {
                        ...state,
                        undoBtn: false,
                        redoBtn: true,
                        clearBtn: true,
                        app_list: JSON.parse(JSON.stringify(state.undoApps[state.undoApps.length - 1]))
                    };
                } else {
                    return {
                        ...state,
                        redoBtn: true,
                        clearBtn: true,
                        app_list: state.undoApps[state.undoApps.length - 1]
                    };
                }
            } else {
                return {
                    ...state,
                    undoBtn: false
                };
            }
        }

        case REDO_APPS: {
            if (state.redoApps.length > 0) {

                let apps = state.redoApps[state.redoApps.length - 1];
                state.redoApps.pop();
                state.undoApps.push(JSON.parse(JSON.stringify(apps)));

                if (state.redoApps.length === 0) {
                    return {
                        ...state,
                        app_list: apps,
                        undoBtn: true,
                        redoBtn: false,
                        clearBtn: true

                    };
                } else {
                    return {
                        ...state,
                        app_list: apps,
                        undoBtn: true
                    };

                }
            } else {
                return {
                    ...state,
                    redoBtn: false
                };
            }
        }

        case CLEAR_APPLICATIONS: {
            let extensions = state.undoExtensions.length ? state.undoExtensions[0] : [];
            let controls = state.undoControls.length ? state.undoControls[0] : [];
            let apps = state.undoApps.length ? state.undoApps[0] : [];
            state.undoApps.length = 1;
            state.undoControls.length = 1;
            state.undoExtensions.length = 1;
            return {
                ...state,
                extensions: extensions,
                controls: controls,
                app_list: apps,
                undoApps: state.undoApps,
                undoControls: state.undoControls,
                undoExtensions: state.undoExtensions,
                redoApps: [],
                redoControls: [],
                redoExtensions: [],
                clearBtn: false,
                redoBtn: false,
                undoBtn: false,
                applyBtn: false,
                changedCtrls: {},
                pageName: MAIN_MENU
            }
        }

        case GET_DEALER_APPS: {

            return {
                ...state,
                apk_list: action.payload,
                apk_list_dump: action.payload
            }
        }

        case SHOW_PUSH_APPS_MODAL: {
            return {
                ...state,
                pushAppsModal: action.payload
            }
        }

        case SHOW_PULL_APPS_MODAL: {
            return {
                ...state,
                pullAppsModal: action.payload
            }
        }

        case GET_IMIE_HISTORY: {
            // console.log(action.payload);
            return {
                ...state,
                imei_list: action.payload,
            }
        }
        case HIDE_POLICY_CONFIRM: {
            return {
                ...state,
                applyPolicyConfirm: false,
            }
        }

        case ADD_SIM_REGISTER: {
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                return {
                    ...state,
                    simUpdated: new Date(),
                    // sim_list: [...state.sim_list, action.payload]
                }
            } else {
                error({
                    title: action.response.msg,
                });
                return {
                    ...state
                }
            }
        }

        case SIM_HISTORY: {

            return {
                ...state,
                simHistoryList: action.payload.data
            }
        }

        case GET_SIMS: {
            // console.log('reducer call')
            let sims = action.payload.data;
            let checkEnc = sims.filter(e => e.encrypt != true);
            let checkGst = sims.filter(e => e.guest != true);
            
            let guestSimAll;
            let encryptSimAll;
            if (checkGst.length > 0) guestSimAll = 0; else guestSimAll = 1;
            if (checkEnc.length > 0) encryptSimAll = 0; else encryptSimAll = 1;

            let checkunrEncrypt = sims.filter(e => e.unrEncrypt != true);
            let checkunrGuest = sims.filter(e => e.unrGuest != true);

            let unrGuest;
            let unrEncrypt;
            if (checkunrGuest.length > 0) unrGuest = 0; else unrGuest = 1;
            if (checkunrEncrypt.length > 0) unrEncrypt = 0; else unrEncrypt = 1;


            return {
                ...state,
                sim_list: sims,
                guestSimAll,
                encryptSimAll,
                unrEncrypt,
                unrGuest,
            }
        }
        case RECEIVE_SIM_DATA: {
            if (action.payload) {
                return {
                    ...state,
                    simUpdated: new Date()
                }
            }
        }

        case DELETE_SIM: {
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });

                let sims = state.sim_list.filter(e => e.id != action.payload.id)
                return {
                    ...state,
                    sim_list: sims,
                    simDeleted: new Date()
                }
            } else {
                error({
                    title: action.response.msg,
                });
                return {
                    ...state
                }
            }
        }

        case UPDATE_SIM: {
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                return {
                    ...state,
                    simUpdated: new Date()
                }
            } else {
                error({
                    title: action.response.msg,
                });
                return {
                    ...state
                }
            }
        }

        case WRITE_IMEI: {
            if (action.payload.status) {
                // if (action.payload.insertedData !== null) {
                //     state.imei_list.unshift(action.payload.insertedData)
                // }

                if (action.payload.online) {
                    success({
                        title: action.imeiData.imeiNo + `${action.payload.title1}` + action.imeiData.type + `${action.payload.title2}`,
                    });
                } else {
                    warning({
                        title: action.payload.msg, //  'Warning Device Offline',
                        content: action.imeiData.imeiNo + `${action.payload.content1}` + action.imeiData.type + `${action.payload.content2}`,
                    });
                }
                // console.log('new state is', state.imei_list)
            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                // imei_list: [...state.imei_list]
            }
        }

        case DEVICE_SYNCED: {
            return {
                ...state,
                reSync: action.payload
            }
        }
        default:
            return state;

    }
}

function handleCheckedAll(applications) {
    let guestCount = 0;
    let encryptedCount = 0;
    let enableCount = 0;

    let guestAll = false;
    let encryptedAll = false;
    let enableAll = false;

    applications.forEach(app => {
        if (app.guest === true || app.guest === 1) {
            guestCount = guestCount + 1;
        }

        if (app.encrypted === true || app.encrypted === 1) {
            encryptedCount = encryptedCount + 1;
        }

        if (app.enable === true || app.enable === 1) {
            enableCount = enableCount + 1;
        }

    })

    if (guestCount === applications.length) {
        guestAll = true;
    }

    if (encryptedCount === applications.length) {
        encryptedAll = true;
    }

    if (enableCount === applications.length) {
        enableAll = true;
    }
    return {
        guestAll: guestAll,
        encryptedAll: encryptedAll,
        enableAll: enableAll
    }
}

function handleCheckedAllExts(extensions) {
    let guestCount = 0;
    let encryptedCount = 0;
    let enableCount = 0;

    let guestAll = false;
    let encryptedAll = false;

    extensions.forEach(app => {
        if (app.guest === true || app.guest === 1) {
            guestCount = guestCount + 1;
        }

        if (app.encrypted === true || app.encrypted === 1) {
            encryptedCount = encryptedCount + 1;
        }

        if (app.enable === true || app.enable === 1) {
            enableCount = enableCount + 1;
        }

    })

    if (guestCount === extensions.length) {
        guestAll = true;
    }

    if (encryptedCount === extensions.length) {
        encryptedAll = true;
    }

    return {
        guestAllExt: guestAll,
        encryptedAllExt: encryptedAll,
    }
}

// function showConfirm1(device, msg, buttonText) {
//     confirm({
//         title: convertToLang(this.props.translation[WARNNING], "WARNNING!"),
//         content: msg,
//         okText: buttonText,
//         cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
//         onOk() {
//             showConfirm(device, convertToLang(this.props.translation[WIPE_DEVICE_DESCRIPTION], "This will permanently wipe the Device. You cannot undo this action. All data will be deleted from target device without any confirmation. There is no way to reverse this action."))
//         },
//         onCancel() { },
//     });
// }
// function showConfirm(device, msg) {
//     confirm({
//         title: convertToLang(this.props.translation[WARNNING], "WARNNING!"),
//         content: msg,
//         // okText: "PROCEED WITH WIPING THE DEVICE",
//         okText: convertToLang(this.props.translation[PROCEED_WITH_WIPING_THE_DEVICE], "PROCEED WITH WIPING THE DEVICE"),
//         cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
//         onOk() {
//             actions.wipe(device)
//         },
//         onCancel() {

//         },
//     });
// }