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
    HANDLE_CHECK_ALL_EXTENSION
} from "../../constants/ActionTypes";

import {
    NOT_AVAILABLE, MAIN_MENU
} from '../../constants/Constants';

import {
    message, Modal
} from 'antd';

const confirm = Modal.confirm;
const actions = require("../../appRedux/actions/ConnectDevice")

const initialState = {
    isLoading: false,

    messageText: '',
    messageType: '',
    showMessage: false,

    pageName: MAIN_MENU,
    status: '',

    syncStatus: false,
    device: {},

    checked_app_id: {},
    app_list: [],
    undoApps: [],
    redoApps: [],

    guestAll: false,
    encryptedAll: false,
    enableAll: false,

    guestAllExt: false,
    encryptedAllExt: false,

    applyBtn: false,
    undoBtn: false,
    redoBtn: false,
    clearBtn: false,

    profiles: [],
    policies: [],
    device_histories: [],
    historyModal: false,
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
    extensions: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case CHANGE_PAGE: {

            return {
                ...state,
                pageName: action.payload
            }
        }
        case GET_DEVICE_DETAILS: {
            let device = action.payload;
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
                    status: status
                }
            } else {
                return {
                    ...state,
                    device: action.payload,
                }

            }

        }
        case SUSPEND_DEVICE2: {
            // console.log('reducer suspend')
            if (action.response.status) {

                state.device = action.response.data;
                state.device.account_status = 'suspended';

                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);

            }
            let device = state.device;

            // console.log('action done ', state.device)
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
                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);

            }
            return {
                ...state,
                isloading: false,
            }
        }

        case UNFLAG_DEVICE:
            console.log(action.response.msg);
            if (action.response.status) {
                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);

            }
            // console.log('action done ', state.device)
            return {
                ...state,
                isloading: false,
            }
        case WIPE_DEVICE:
            console.log(action.response.msg);
            if (action.response.status) {
                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);

            }
            // console.log('action done ', state.device)
            return {
                ...state,
                isloading: false,
            }

        case GET_DEVICE_APPS: {
            // console.log(GET_DEVICE_APPS);
            state.undoApps.push(JSON.parse(JSON.stringify(action.payload)));
            let applications = action.payload;
            let check = handleCheckedAll(applications);
            // console.log({
            //     ...state,
            //     isloading: true,
            //     app_list: action.payload
            // });
            return {
                ...state,
                // isloading: true,
                app_list: action.payload,
                extensions: action.extensions,
                // guestAll: guestAll,
                // encryptedAll: encryptedAll,
                // enableAll: enableAll
                ...check
            }
        }
        case GET_PROFILES: {
            //  console.log('GET_PROFILES');
            // console.log({
            //     ...state,
            //     isloading: true,
            //     profiles: action.payload
            // });
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

        case GET_USER_ACC_ID: {
            //  console.log('GET_USER_ACC_ID',action.response.user_acount_id);

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
            // state.undoApps.push(JSON.parse(JSON.stringify(action.payload)));
            // console.log("undo apps", state.undoApps);

            return {
                ...state
            }
        }
        case UNDO_APPS: {

            if (state.undoApps.length > 1) {

                let apps = state.undoApps[state.undoApps.length - 1];
                console.log("undo apps", state.undoApps);
                state.undoApps.pop();

                state.redoApps.push(JSON.parse(JSON.stringify(apps)));
                console.log("undo apps", state.undoApps);

                if (state.undoApps.length === 1) {
                    return {
                        ...state,
                        undoBtn: false,
                        redoBtn: true,
                        app_list: JSON.parse(JSON.stringify(state.undoApps[state.undoApps.length - 1]))
                    };
                } else {
                    return {
                        ...state,
                        redoBtn: true,
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
                        redoBtn: false
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
            // console.log(SETTINGS_APPLIED);
            // console.log(action.payload);
            return {
                ...state,
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
            //     ...state,
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

        case SHOW_MESSAGE: {

            return {
                ...state,
                showMessage: action.payload.showMessage,
                messageType: action.payload.messageType,
                messageText: action.payload.messageText
            }
        }

        case ACTIVATE_DEVICE2: {

            //  console.log(state.device, 'active device done', action.payload.device);
            if (action.response.status) {

                state.device = action.response.data;
                state.status = '';
                state.pageName = 'main_menu'

                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);

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
                message.success(action.response.msg)
            } else {
                message.error(action.response.msg)
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
            // console.log(ENCRYPTED_PASSWORD);
            // console.log(action.payload);
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
                showConfirm1(action.payload.device, "Do You really Want to Wipe the device")
            }
            else {
                message.error("Password Did not Match. Please Try again.");
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
        case SHOW_SAVE_PROFILE_MODAL: {
            return {
                ...state,
                saveProfileModal: action.payload.visible,
                saveProfileType: action.payload.profileType
            }
        }

        case HANDLE_CHECK_EXTENSION: {
            // let changedExtensions = state.extensions;
            // let applications = state.extensions;
            //  console.log(action.payload.ext, 'reducer ', changedExtensions);
            state.extensions.forEach(extension => {
                // console.log(extension.uniqueName, 'name compare', action.payload.uniqueName)
                if (extension.uniqueName === action.payload.uniqueName) {
                    let objIndex = extension.subExtension.findIndex((obj => obj.app_id === action.payload.app_id));
                    //   console.log(action.payload.value, 'chenged item', extension.subExtension[objIndex][action.payload.key])
                    if (objIndex > -1)
                        extension.subExtension[objIndex][action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                }
            });
            let check = '';

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
                ...check
            }
        }

        case HANDLE_CHECK_ALL_EXTENSION: {
            console.log('reducer is called', action.payload.uniqueName)
            let changedExtensions = state.extensions;
            let applications = state.extensions;
            //  console.log(action.payload.ext, 'reducer ', changedExtensions);
            state[action.payload.keyAll] = action.payload.value;
            changedExtensions.forEach(extension => {
                // console.log(extension.uniqueName, 'name compare', action.payload.uniqueName)
                if (extension.uniqueName === action.payload.uniqueName) {
                    for (let subExt of extension.subExtension) {
                        subExt[action.payload.key] = action.payload.value == true ? 1 : 0;

                    }
                    // let objIndex = extension.subExtension.findIndex((obj => obj.app_id === action.payload.app_id));
                    console.log('chenged item', extension.subExtension)
                    //    if(objIndex > -1)
                    //     extension.subExtension[objIndex][action.payload.key] = action.payload.value== true ? 1:0;
                }
            });
            // state.undoApps.push(changedApps);
            //  let check = handleCheckedAll(applications);
            // let check = '';

            return {
                ...state,
                extensions: changedExtensions,

                applyBtn: true,
                undoBtn: true,
                // ...check
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
                ...check
            }
        }

        case HANDLE_CHECK_ALL: {
            let applications = state.app_list;
            applications.forEach(app => {
                app[action.payload.key] = action.payload.value;
                app.isChanged = true;
            })
            state[action.payload.keyAll] = action.payload.value;
            state.undoApps.push(JSON.parse(JSON.stringify(applications)));
            // console.log("undo apps", state.undoApps);

            return {
                ...state,
                app_list: applications,
                checked_app_id: {
                    key: action.payload.key,
                    value: action.payload.value,
                },
                applyBtn: true,
                undoBtn: true
            }
        }
        case GET_DEALER_APPS: {

            return {
                ...state,
                apk_list: action.payload,
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
function showConfirm1(device, msg) {
    confirm({
        title: 'WARNNING!',
        content: msg,
        okText: "WIPE DEVICE",
        onOk() {
            showConfirm(device, "This will permanently wipe the Device. You cannot undo this action. All data will be deleted from target device without any confirmation. There is no way to reverse this action.")
        },
        onCancel() { },
    });
}
function showConfirm(device, msg) {
    confirm({
        title: 'WARNNING!',
        content: msg,
        okText: "PROCEED WITH WIPING THE DEVICE",
        onOk() {
            actions.wipe(device)
        },
        onCancel() { },
    });
}