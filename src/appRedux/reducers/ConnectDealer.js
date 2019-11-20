import { message, Modal, Alert, Icon } from 'antd';

import {
    DEALER_DETAILS
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

    dealer: null,
    
};

export default (state = initialState, action) => {

    switch (action.type) {

        case DEALER_DETAILS: {
            console.log(action.payload)
            return {
                ...state,
                dealer: action.payload.dealer
            }
        }
        default:
            return state;

    }
}
