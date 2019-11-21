import { message, Modal, Alert, Icon } from 'antd';

import {
    DEALER_DETAILS, CONNECT_EDIT_DEALER, CONNECT_SUSPEND_DEALER, CONNECT_ACTIVATE_DEALER, CONNECT_DELETE_DEALER, CONNECT_UNDO_DEALER
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
        
        case CONNECT_SUSPEND_DEALER:{
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            if (action.response.status === true) {
                dealer.account_status = 'suspended';
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
                dealer: dealer
            }
        }
        
        case CONNECT_ACTIVATE_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            if (action.response.status) {
                // let objIndex1 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                // state.dealers[objIndex1].account_status = null;
                dealer.account_status = null;
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
                dealer: dealer
            }
        }

        case CONNECT_DELETE_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));

            if (action.response.status) {
                // let objIndex2 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                // state.dealers[objIndex2].unlink_status = 1;
                dealer.unlink_status = 1;
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
                dealer: dealer
            }
        }
        case CONNECT_UNDO_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            if (action.response.status) {
                // let objIndex3 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                // state.dealers[objIndex3].unlink_status = 0;
                dealer.unlink_status = 0
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
                dealer: dealer
            }
        }
        default:
            return state;

    }
}
