import {
    SAVE_USERS,
    LOADING,
    USERS_LIST
} from "constants/ActionTypes";
import { message } from 'antd';

const initialState = {
    isloading: false,
    subIsloading: false,
    users_list: [],
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

        case USERS_LIST:
            console.log('item added is:', action.payload)
            return {
                ...state,
                isloading: false,
                users_list: action.payload.users_list,
            }


        default:
            return state;

    }
}