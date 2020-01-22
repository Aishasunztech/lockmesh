import {
    NEW_REQUEST_LIST,
    REJECT_REQUEST,
    ACCEPT_REQUEST,
    USER_CREDITS,
    GET_CANCEL_REQUEST,
    ACCEPT_SERVICE_REQUEST,
    REJECT_SERVICES_REQUEST,
    NEW_NOTIFICATION_LIST,
    UPDATE_NOTIFICATION_STATUS,
    SET_ADMIN_FOR_SUPPORT_TICKETS,
    UPDATE_SUPPORT_TICKET_NOTIFICATIONS
} from "../../constants/ActionTypes";
import { Modal, notification } from 'antd';

const success = Modal.success
const error = Modal.error

const initialSidebar = {
    whiteLabels: [],
    newRequests: [],
    user_credit: 0,
    due_credit: 0,
    admin: {},
    credits_limit: 0,
    cancel_service_requests: [],
    ticketNotifications: []
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
                credits_limit: action.response.credits_limit
            }
        }
        case GET_CANCEL_REQUEST: {

            return {
                ...state,
                cancel_service_requests: action.response.data,
            }
        }
        case NEW_NOTIFICATION_LIST: {

            return {
                ...state,
                ticketNotifications: action.payload.status ? action.payload.tickets : [],
            }
        }

        case ACCEPT_SERVICE_REQUEST: {
            var newRequests = state.cancel_service_requests;
            var request_id = action.request.id;
            var filteredRequests = newRequests;

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
                cancel_service_requests: filteredRequests,
            }
        }

        case REJECT_SERVICES_REQUEST: {

            var newRequests = state.cancel_service_requests;
            var request_id = action.request.id;
            var filteredRequests = newRequests;

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
                cancel_service_requests: filteredRequests,
            }
        }

        case UPDATE_NOTIFICATION_STATUS: {

            let notifications = state.ticketNotifications
            let updateNotifications = notifications.filter(notification => notification.ticket._id != action.payload)
            return {
                ...state,
                ticketNotifications: updateNotifications,
            }
        }

        case SET_ADMIN_FOR_SUPPORT_TICKETS: {
            return {
                ...state,
                admin: action.payload
            }
        }

        case UPDATE_SUPPORT_TICKET_NOTIFICATIONS: {
            let ticketNotifications = state.ticketNotifications
            if (action.payload.status) {
                ticketNotifications.push(action.payload.data)
            }
            return {
                ...state,
                ticketNotifications: [...ticketNotifications],
            }
        }

        case UPDATE_SUPPORT_TICKET_NOTIFICATIONS: {
            let ticketNotifications = state.ticketNotifications
            if (action.payload.status) {
                ticketNotifications.push(action.payload.data)
            }
            return {
                ...state,
                ticketNotifications: [...ticketNotifications],
            }
        }

        default:
            return state;
    }
}
