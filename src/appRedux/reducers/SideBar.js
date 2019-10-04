import {
    NEW_REQUEST_LIST,
    REJECT_REQUEST,
    ACCEPT_REQUEST,
    USER_CREDITS
} from "../../constants/ActionTypes";
import { Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialSidebar = {
    whiteLabels: [],
    newRequests: [],
    user_credit: 0
};

export default (state = initialSidebar, action) => {

    switch (action.type) {

        case NEW_REQUEST_LIST:
            // console.log('reducer new device', action.payload);
            return {
                ...state,
                newRequests: action.payload,
            }
        case REJECT_REQUEST: {


            var newRequests = state.newRequests;
            var request_id = action.request.id;
            var filteredRequests = newRequests

            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                filteredRequests = newRequests.filter(request => request.id !== request_id);
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                newRequests: filteredRequests,
            }
        }
        case ACCEPT_REQUEST: {

            var newRequests = state.newRequests;
            var request_id = action.request.id;
            var filteredRequests = newRequests;
            var user_credit = state.user_credit

            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                filteredRequests = newRequests.filter(request => request.id !== request_id);
                user_credit = action.response.user_credits
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                newRequests: filteredRequests,
                user_credit: user_credit
            }
        }

        case USER_CREDITS: {
            // console.log("REMAINING CREDITS", action.response.credits);
            return {
                ...state,
                user_credit: action.response.credits,
            }
        }


        default:
            return state;
    }
}