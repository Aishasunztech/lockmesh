import { message, Modal, Alert, Icon } from 'antd';

import {
    DEALER_DETAILS, CONNECT_EDIT_DEALER
} from "../../constants/ActionTypes";

// import { Button_Cancel } from '../../constants/ButtonConstants';
// import { convertToLang } from '../../routes/utils/commonUtils';
// import { WIPE_DEVICE_DESCRIPTION } from '../../constants/DeviceConstants';

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
        case CONNECT_EDIT_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            // let dealer = state.dealer;
            if(action.response.status){
                dealer.dealer_name = action.payload.formData.name;
                dealer.dealer_email = action.payload.formData.email;
                if (action.response.alreadyAvailable === false) {
                    success({
                        title: action.response.msg,
                    });
                } else {
                    error({
                        title: action.response.msg, // "Given email is already in use. Please choose different Email",
                    });
                }
            } else {
                error({
                    title: action.response.msg,
                });
            }
            return {
                ...state,
                dealer: dealer
                
            };
        }
        default:
            return state;

    }
}
