import { STAND_ALONE_LIST } from "../../constants/ActionTypes";

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

        case STAND_ALONE_LIST: {
            return {
                ...state,
                standAloneSimsList: action.payload
            }
        }


        default:
            return state;

    }
}