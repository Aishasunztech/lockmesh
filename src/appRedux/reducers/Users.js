import {
    SAVE_USERS,
    LOAD_USER,
    LOADING,
    USERS_LIST,
    EDIT_USERS
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
            let result = []
            if (action.response.status) {
                message.success(action.response.msg)
                result = [...action.response.user, ...state.users_list]
            }
            else {
                message.error(action.response.msg)
                result = state.users_list
            }
            // console.log(result);
            return {
                ...state,
                isloading: false,
                addUserFlag: false,
                users_list: result,
            }
        case EDIT_USERS:
            console.log('item added is:', action.response)
            if (action.response.status) {
                let objIndex4 = state.users_list.findIndex((obj => obj.user_id === action.payload.userData.user_id));
                state.users_list[objIndex4] = action.response.user[0];

                message.success(action.response.msg);
            }
            else {
                message.error(action.response.msg)
            }

            return {
                ...state,
                isloading: false,
                addUserFlag: false,
                users_list: [...state.users_list]
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