import {
    SAVE_USERS,
    LOAD_USER,
    LOADING,
    USERS_LIST
} from "../../constants/ActionTypes";
import { message } from 'antd';

const initialState = {
    isloading: false,
    addUserFlag: false,
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
            // console.log('item added is:', action.response.user)

            if (action.response.status) {
                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }
            return {
                ...state,
                isloading: false,
                addUserFlag: false,
                users_list: [...state.users_list, ...action.response.user],
            }
        case LOAD_USER: 
            return {
                ...state,
                addUserFlag: true,
            }

        case USERS_LIST:
            // console.log('item added is:', action.payload.users_list)
            return {
                ...state,
                isloading: false,
                users_list: action.payload.users_list,
            }
        default:
            return state;

    }
}