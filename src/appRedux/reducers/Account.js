import {
    IMPORT_CSV,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    RELEASE_CSV,
    DUPLICATE_SIM_IDS,
    NEW_DATA_INSERTED
} from "constants/ActionTypes";
import { message, Modal } from "antd";

const success = Modal.success
const error = Modal.error

const initialState = {
    msg: "",
    showMsg: false,
    used_pgp_emails: [],
    used_sim_ids: [],
    used_chat_ids: [],
    duplicate_ids: [],
    duplicate_modal_show: false,
    duplicate_data_type: '',
    newData: [],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case IMPORT_CSV:
            return {
                ...state,
                msg: action.payload.msg,
                showMsg: action.showMsg,
            }
        case GET_USED_PGP_EMAILS: {
            // alert("hello");
            return {
                ...state,
                used_pgp_emails: action.payload
            }
        }
        case GET_USED_CHAT_IDS: {
            // alert("hello");
            return {
                ...state,
                used_chat_ids: action.payload
            }
        }
        case GET_USED_SIM_IDS: {
            // alert("hello");
            return {
                ...state,
                used_sim_ids: action.payload
            }
        }

        case NEW_DATA_INSERTED: {

            if (action.payload.status && action.showMsg) {
                success({
                    title: action.payload.msg,
                });
            } else if (action.payload.status == false && action.showMsg) {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                duplicate_ids: [],
                duplicate_data_type: '',
                duplicate_modal_show: false,
                newData: []

            }
        }

        case DUPLICATE_SIM_IDS: {
            return {
                ...state,
                duplicate_ids: action.payload.duplicateData,
                duplicate_data_type: action.payload.type,
                duplicate_modal_show: true,
                newData: action.payload.newData
            }
        }

        case RELEASE_CSV: {
            // alert("hello");
            // console.log(action.payload);
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            }
            else {
                error({
                    title: action.payload.msg,
                });

            }
            if (action.payload.type === 'sim') {
                return {
                    ...state,
                    used_sim_ids: action.payload.data
                }
            } else if (action.payload.type === 'chat') {
                return {
                    ...state,
                    used_chat_ids: action.payload.data
                }
            } else if (action.payload.type === 'pgp') {
                return {
                    ...state,
                    used_pgp_emails: action.payload.data
                }
            } else {
                return {
                    ...state,
                }
            }
        }
        default:
            return state;
    }
}