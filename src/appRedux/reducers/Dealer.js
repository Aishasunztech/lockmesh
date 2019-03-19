import {
    DEALERS_LIST,
    SUSPEND_DEALERS,
    DELETE_DEALERS,
    EDIT_DEALER,
    CHANGE_PASSWORD,
    ACTIVATE_DEALER,
    UNDO_DEALER,
    ADD_DEALER,
    LOADING,
    GET_DROPDOWN,
    POST_DROPDOWN
} from "constants/ActionTypes";
import { message } from 'antd';

const initialState = {
    isloading: false,
    dealers: [],
    suspended: 'no change',
    action: '',
    msg: 'no message',
    selectedOptions: [],
    options: ["DEALER ID", "DEALER NAME", "DEALER EMAIL", "DEALER PIN", "CONNECTED DEVICES", "TOKENS"],

};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:

            return {
                ...state,
                isloading: true,
                dealers: [],
                options: state.options
            }

        case DEALERS_LIST:
            // console.log('DEALERS_LIST');

            return {
                ...state,
                isloading: false,
                dealers: action.payload,
                options: state.options
            }



        case SUSPEND_DEALERS:

            if (action.response.status === true) {
                let objIndex = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex].account_status = "suspended";
                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }

            return {
                ...state,
                dealers: [...state.dealers],
                isloading: false,
                suspended: action.payload.msg,
                action: action.payload,
            }


        case ACTIVATE_DEALER:

            if (action.response.status) {
                let objIndex1 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex1].account_status = null;
                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }

            return {
                ...state,
                dealers: [...state.dealers],
                isloading: false,
                suspended: action.payload.msg,
                action: action.payload,
            }



        case DELETE_DEALERS:

            if (action.response.status) {
                let objIndex2 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex2].unlink_status = 1;
                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }


            return {
                ...state,
                dealers: [...state.dealers],
                isloading: false,
                action: action.payload,
            }


        case UNDO_DEALER:

            if (action.response.status) {
                let objIndex3 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex3].unlink_status = 0;
                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }


            return {
                ...state,
                dealers: [...state.dealers],
                isloading: false,
                action: action.payload,
            }


        case CHANGE_PASSWORD:

            if (action.response.status) {

                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }

            return {
                ...state,
                dealers: [...state.dealers],
                isloading: false,
                action: action.payload,
            }


        case EDIT_DEALER:

            if (action.response.status) {
              
                let objIndex4 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.formData.dealer_id));
                if (objIndex4 !== undefined) {
                    state.dealers[objIndex4].dealer_name = action.payload.formData.name;
                    state.dealers[objIndex4].dealer_email = action.payload.formData.email;
                }

                message.success(action.response.msg)
            }
            else {
                message.error(action.response.msg)
            }

            return {

                dealers: [...state.dealers],
                selectedOptions: [...state.selectedOptions],
                isloading: false,
                action: action.payload,
            }


        case ADD_DEALER:
            // console.log('item added is:',action.response.item_added[0])

            if (action.response.status) {
                message.success(action.response.msg)
                // if(action.response.item_added[0] !== undefined)
                // {
                //     state.dealers.push({'dchec':'lsdkflk'})
                // }
                //  console.log('daelers length',state.dealers.length)
                //  state.dealers[state.dealers.length] = action.response.item_added[0];
            }
            else {
                message.error(action.response.msg)
            }
            // console.log('msg', action.payload.msg)
            return {
                ...state,
                isloading: false,
                dealers: [...state.dealers],
                options: [...state.options],

            }
            break;
        case GET_DROPDOWN:{
            // console.log(GET_DROPDOWN);
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            return {
                ...state,
                selectedOptions: action.payload
            }
        }

        case POST_DROPDOWN: {
            return {
                ...state
            }
        }
        default:
            return state;

    }
}