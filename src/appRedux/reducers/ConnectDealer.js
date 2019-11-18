import { message, Modal, Alert, Icon } from 'antd';

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
    MESSAGE_HANDLER,
    TRANSFER_HISTORY,
    SINGLE_APP_PULLED,
    SINGLE_APP_PUSHED,
    PASSWORD_CHANGED,
    PUSH_APP_CHECKED,
    RESET_PUSH_APPS,
    GET_UNREG_SIMS,
    HANDLE_CHECK_ALL_PUSH_APPS,
    HANDLE_CHECK_SECURE_SETTINGS,
    RESET_DEVICE,
    SIM_LOADING,
    TRANSFER_DEVICE,
    SERVICES_DETAIL,
    SERVICES_HISTORY,
    CANCEL_EXTENDED_SERVICE
} from "../../constants/ActionTypes";

import {
    NOT_AVAILABLE, MAIN_MENU, WARNNING, PROCEED_WITH_WIPING_THE_DEVICE, Main_SETTINGS, SECURE_SETTING, SAVE_PROFILE_TEXT, APPS, SYSTEM_CONTROLS
} from '../../constants/Constants';

import { ACK_UNINSTALLED_APPS, ACK_INSTALLED_APPS, ACK_SETTING_APPLIED, SEND_ONLINE_OFFLINE_STATUS } from '../../constants/SocketConstants';
// import { Button_Cancel } from '../../constants/ButtonConstants';
// import { convertToLang } from '../../routes/utils/commonUtils';
// import { WIPE_DEVICE_DESCRIPTION } from '../../constants/DeviceConstants';

const warning = Modal.warning;
const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error


const initialState = {
    isLoading: false,
    messageText: '',
    messageType: '',
    showMessage: false,

    dealer: {},
    
};

export default (state = initialState, action) => {

    switch (action.type) {

        
        default:
            return state;

    }
}
