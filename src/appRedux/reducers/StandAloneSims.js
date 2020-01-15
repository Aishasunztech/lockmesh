import {
    SAVE_USERS,
    LOAD_USER,
    LOADING,
    USERS_LIST,
    EDIT_USERS,
    DELETE_USER,
    UNDO_DELETE_USER,
    DEALER_USERS,
    INVOICE_ID
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success
const error = Modal.error

const initialState = {
    isloading: false,
    standAloneSimsList: [],
    options: [],
    action: '',
    msg: 'no message',
};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:

            return {
                ...state,
                isloading: true,
                users: [],
            }

        case USERS_LIST:
            return {
                ...state,
                isloading: false,
                standAloneSimsList: action.payload.users_list,
            }


        default:
            return state;

    }
}