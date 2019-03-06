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
    SUSPEND_DEVICE2
} from "constants/ActionTypes";
import { message } from 'antd';

const initialState = {
    isLoading: false,

    messageText: '',
    messageType: '',
    showMessage: false,

    pageName: "main_menu",


    syncStatus: false,
    device: {},

    app_list: [],
    undoApps: [],
    redoApps: [],

    applyBtn: true,
    undoBtn: true,
    redoBtn: true,
    clearBtn: false,

    profiles: [],
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
    duressCPwd: ''
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
        case GET_DEVICE_DETAILS:
            // console.log('all states from reducer ', action.payload);

            // console.log({

            //     ...state,
            //     isloading: true,
            //     device: action.payload,
            // });
            //  console.log('connect device reducer',...state)

            return {
                ...state,
                isloading: true,
                device: action.payload,
            }

        case SUSPEND_DEVICE2: {
            // console.log('reducer suspend')
            if (action.response.status) {

                state.device.account_status = 'suspended';

                message.success(action.response.msg);
            }
            else {
                message.error(action.response.msg);

            }

            // console.log('action done ', state.device)
            return {
                ...state,
            
                isloading: false
            }
        }
        case GET_DEVICE_APPS:
            // console.log(GET_DEVICE_APPS);
            state.undoApps.push(JSON.parse(JSON.stringify(action.payload)));

            // console.log({
            //     ...state,
            //     isloading: true,
            //     app_list: action.payload
            // });
            return {
                ...state,
                isloading: true,
                app_list: action.payload
            }

        case GET_PROFILES:
            // console.log(GET_PROFILES);
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
                    app_list: state.undoApps[state.undoApps.length - 1]
                };
            } else {
                return state;
            }
        }
        case REDO_APPS: {
            // console.log(UNDO_APPS);
            if (state.redoApps.length > 0) {
                let apps = state.redoApps[state.redoApps.length - 1];
                state.redoApps.pop();
                state.undoApps.push(apps);
                return {
                    ...state,
                    app_list: apps
                };
            } else {
                return state;
            }
        }
        case LOAD_PROFILE: {
            // console.log(LOAD_PROFILE);
            state.undoApps.push(action.payload);

            return {
                ...state,
                app_list: action.payload
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
            return {
                ...state,
                historyType: action.payload.profileType,
                historyModal: action.payload.visible
            }
        }
        case END_LOADING: {
            // console.log(END_LOADING);

            // console.log({
            //     ...state,
            //     isLoading: false
            // });

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

                state.device.account_status = '';

                message.success(action.response.msg);
            }
            else {
                message.error(action.response.msg);

            }

            // console.log('action done ', state.device)
            return {
                ...state,
          
                isloading: true
            }
        }

        case UNLINK_DEVICE: {
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
                isGuestPwd: true
            }
        }
        case ENCRYPTED_PASSWORD: {
            // console.log(ENCRYPTED_PASSWORD);
            // console.log(action.payload);
            return {
                ...state,
                encryptedPwd: action.payload.pwd,
                encryptedCPwd: action.payload.confirm,
                isEncryptedPwd: true
            }
        }
        case DURESS_PASSWORD: {
            // console.log(DURESS_PASSWORD);
            // console.log(action.payload);
            return {
                ...state,
                duressPwd: action.payload.pwd,
                duressCPwd: action.payload.confirm,
                isDuressPwd: true
            }
        }
        case ADMIN_PASSWORD: {
            // console.log(ADMIN_PASSWORD);
            // console.log(action.payload);
            return {
                ...state,
                adminPwd: action.payload.pwd,
                adminCPwd: action.payload.confirm,
                isAdminPwd: true
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
        default:
            return state;

    }
}