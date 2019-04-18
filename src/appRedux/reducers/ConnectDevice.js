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
    GET_DEALER_APPS
} from "../../constants/ActionTypes";
import {
    message, Modal
} from 'antd';
import { stat } from "fs";
const confirm = Modal.confirm;
const actions = require("../../appRedux/actions/ConnectDevice")
const initialState = {
    isLoading: false,

    messageText: '',
    messageType: '',
    showMessage: false,

    pageName: "main_menu",
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
            // console.log(CHANGE_PAGE);
            // console.log({
            //     ...state,
            //     pageName: action.payload
            // });

            return {
                ...state,
                pageName: action.payload
            }
        }
        case GET_DEVICE_DETAILS: {
            let device = action.payload;
            //

            //    console.log(action.payload,'reducer detail')
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
                    pageName: 'not_available',
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
            }

        }

        case FLAG_DEVICE:

            if (action.response.status) {

                state.device = action.response.data;
                // state.device.account_status = 'suspended';
                // state.device.finalStatus = 'Suspended';
                state.pageName = 'not_available';
                state.status = 'Suspended';
                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);

            }
            let device = state.device;

            // console.log('action done ', state.device)
            return {
                ...state,
                isloading: false,
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
        case GET_PROFILES:
            {
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

        case GET_POLICIES:
            {
                //  console.log('GET_PROFILES');
                // console.log({
                //     ...state,
                //     isloading: true,
                //     profiles: action.payload
                // });
                return {
                    ...state,
                    isloading: true,
                    policies: action.payload
                }
            }


        case GET_USER_ACC_ID:
            {
                //  console.log('GET_USER_ACC_ID',action.response.user_acount_id);

                return {
                    ...state,
                    isloading: true,
                    user_acc_id: action.response.user_acount_id
                }
            }
        case GET_DEVICE_HISTORIES:
            {

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
        case PUSH_APPS:
            {
                // console.log(PUSH_APPS);
                state.undoApps.push(action.payload);

                return {
                    ...state
                }
            }
        case UNDO_APPS: {

            // console.log(UNDO_APPS);
            if (state.undoApps.length > 1) {
                let apps = state.undoApps[state.undoApps.length - 1];
                state.undoApps.pop();
                state.redoApps.push(apps);
                return {
                    ...state,
                    redoBtn: true,
                    app_list: state.undoApps[state.undoApps.length - 1]
                };
            } else {
                return {
                    ...state,
                    undoBtn: false
                };
            }
        }
        case REDO_APPS:
            {
                // console.log(UNDO_APPS);
                if (state.redoApps.length > 0) {
                    let apps = state.redoApps[state.redoApps.length - 1];
                    state.redoApps.pop();
                    state.undoApps.push(apps);
                    return {
                        ...state,
                        app_list: apps,
                        undoBtn: true
                    };
                } else {
                    return state;
                }
            }
        case LOAD_PROFILE:
            {
                // console.log(LOAD_PROFILE);
                state.undoApps.push(action.payload);
                let check = handleCheckedAll(action.payload);
                return {
                    ...state,
                    app_list: action.payload,
                    ...check
                }
            }
        case SETTINGS_APPLIED:
            {
                // console.log(SETTINGS_APPLIED);
                // console.log(action.payload);
                return {
                    ...state,
                }
            }
        case START_LOADING:
            {
                return {
                    ...state,
                    isLoading: true
                }
            }
        case SHOW_HISTORY_MODAL:
            {
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
        case END_LOADING:
            {

                return {
                    ...state,
                    isLoading: false
                }
            }
        case SHOW_MESSAGE:
            {

                return {
                    ...state,
                    showMessage: action.payload.showMessage,
                    messageType: action.payload.messageType,
                    messageText: action.payload.messageText
                }
            }

        case ACTIVATE_DEVICE2:
            {

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
        case GUEST_PASSWORD:
            {
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
        case ENCRYPTED_PASSWORD:
            {
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
            // console.log(DURESS_PASSWORD);
            // console.log(action.payload);
            return {
                ...state,
                duressPwd: action.payload.pwd,
                duressCPwd: action.payload.confirm,
                isDuressPwd: true,
                applyBtn: true
            }
        }
        case ADMIN_PASSWORD: {
            // console.log(ADMIN_PASSWORD);
            // console.log(action.payload);
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
        case SHOW_SAVE_PROFILE_MODAL:
            {
                return {
                    ...state,
                    saveProfileModal: action.payload.visible,
                    saveProfileType: action.payload.profileType
                }
            }
        case HANDLE_CHECK_APP: {
            let changedApps = state.app_list;
            let applications = state.app_list;
            changedApps.forEach(app => {
                if (app.app_id === action.payload.app_id) {
                    app[action.payload.key] = action.payload.value;
                }
            });
            state.undoApps.push(changedApps);
            let check = handleCheckedAll(applications);

            return {
                ...state,
                app_list: changedApps,
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
            })
            state[action.payload.keyAll] = action.payload.value;
            state.undoApps.push(applications);
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