import {
    SAVE_USERS,
    LOADING,
} from "constants/ActionTypes";
import { message } from 'antd';

const initialState = {
    isloading: false,
    subIsloading: false,
    users: [],
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
        case SAVE_USERS:
            console.log('item added is:', action.response)
            if (action.response.status) {
                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }
            return {
                ...state,
                isloading: false,
                users: [],
            }

        case SAVE_USERS:
            console.log('item added is:', action.response)
            return {
                ...state,
                isloading: false,
                users: action.payload,
            }


        default:
            return state;

    }
}