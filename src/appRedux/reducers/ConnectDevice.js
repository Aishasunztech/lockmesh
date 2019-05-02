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
    GET_IMIE_HISTORY
} from "../../constants/ActionTypes";

import {
    NOT_AVAILABLE, MAIN_MENU,
} from '../../constants/Constants';

import {
    message, Modal
} from 'antd';

const confirm = Modal.confirm;
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

    syncStatus: false,
    device: {},
    allExtensions: [],

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

    extensions: [],
    secureSettingsMain: [],

    undoExtensions: [],
    redoExtensions: [],
    controls: {},
    undoControls: [],
    redoControls: [],

    guestAllExt: false,
    encryptedAllExt: false,

    imei_list: [],
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
            if (action.response.status) {

                state.device = action.response.data;
                state.device.account_status = 'suspended';

                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);

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
            // console.log(action.response.msg);
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
            // console.log(action.response.msg);
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
            // state.undoApps.push(JSON.parse(JSON.stringify(action.payload)));
            // console.log("undo apps", state.undoApps);

            return {
                ...state
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
                pageName: MAIN_MENU,
                showMessage: false,
                // applyBtn: false,
                // undoBtn: false,
                // redoBtn: false,
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


        case GET_APPS_PERMISSIONS: {
            // console.log('data permissions', action.payload)
            return {
                ...state,
                appPermissions: action.payload.appPermissions,
                allExtensions: action.payload.extensions

            }
        }

 


        case HANDLE_CHECK_CONTROL: {
            let changedControls = JSON.parse(JSON.stringify(state.controls.controls));
            if(action.payload.key == 'wifi_status'){
                changedControls[action.payload.key] = true;
            }else{
                changedControls[action.payload.key] = action.payload.value;
            }
           
            state.controls.controls = JSON.parse(JSON.stringify(changedControls));
            let controls = state.controls;
            state.undoControls.push(JSON.parse(JSON.stringify(changedControls)));
            // console.log('reduver aongds', state.controls);

            return {
                ...state,
                controls: state.controls,   
                forceUpdate: state.forceUpdate + 1,
                applyBtn: true,
                undoBtn: true
            }
        }

        case HANDLE_CHECK_MAIN_SETTINGS: {

            let changedControls = JSON.parse(JSON.stringify(state.controls));
             let objIndex = changedControls.settings.findIndex(item => item.uniqueName === action.payload.main);
            // console.log(action.payload.main,' obj index is', objIndex)
             if(objIndex > -1){
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
                undoBtn: true
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
                        redoBtn: false
                    };
                } else {
                    return {
                        ...state,
                        controls: controls,
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

        case HANDLE_CHECK_EXTENSION: {

            let changedExtensions = JSON.parse(JSON.stringify(state.extensions));
           

            changedExtensions.forEach(extension => {
                if (extension.uniqueName === action.payload.uniqueName) {
                    if(action.payload.app_id === '000'){
                        extension[action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;   
                    }else{
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
                ...check
            }
        }

        case HANDLE_CHECK_ALL_EXTENSION: {
            let changedExtensions = JSON.parse(JSON.stringify(state.extensions));
            state[action.payload.keyAll] = action.payload.value;
            changedExtensions.forEach(extension => {
                if (extension.uniqueName === action.payload.uniqueName) {
                    for (let subExt of extension.subExtension) {
                        subExt[action.payload.key] = action.payload.value == true ? 1 : 0;
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
                        extensions: state.undoExtensions[state.undoApps.length - 1]
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
            // console.log('REDUCER UNDO');
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
                        redoBtn: false
                    };
                } else {
                    return {
                        ...state,
                        extensions: extensions,
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
            let applications = JSON.parse(JSON.stringify(state.app_list));
            applications.forEach(app => {
                // console.log(app[action.payload.key], 'kkkkkk', 'guest')
                if(app.default_app != 1){
                    app[action.payload.key] = action.payload.value;
                    app.isChanged = true;
                }else if(app.default_app == 1 && action.payload.key == 'guest'){
                    app.isChanged = true;
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
                undoBtn: true
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
        case GET_DEALER_APPS: {

            return {
                ...state,
                apk_list: action.payload,
            }
        }
        case GET_IMIE_HISTORY: {
            // console.log(action.payload);
            return {
                ...state,
                imei_list: action.payload,
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