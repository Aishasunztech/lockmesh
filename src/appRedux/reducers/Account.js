import {
    IMPORT_CSV,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    RELEASE_CSV,
} from "constants/ActionTypes";
import { message } from "antd";

const initialState = {
    msg: "",
    showMsg: false,
    used_pgp_emails: [],
    used_sim_ids: [],
    used_chat_ids: [],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case IMPORT_CSV:
            return {
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
        case RELEASE_CSV: {
            // alert("hello");
            console.log(action.payload);
            if (action.payload.status) {
                message.success(action.payload.msg)
            }
            else {
                message.error(action.payload.msg)

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