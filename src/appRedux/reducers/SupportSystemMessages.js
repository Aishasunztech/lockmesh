import {
  GENERATE_SUPPORT_SYSTEM_MESSAGE,
  GET_SUPPORT_SYSTEM_MESSAGE,
  GET_RECEIVED_SUPPORT_SYSTEM_MESSAGES,
  LOADING, UPDATE_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION, GET_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION, SYSTEM_SUPPORT_MESSAGE_RECEIVED, ADD_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success;
const error = Modal.error;
const initialState = {
  isloading: true,
  supportSystemMessages: [],
  receivedSupportSystemMessages: [],
  supportSystemMessagesNotifications: [],
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case GENERATE_SUPPORT_SYSTEM_MESSAGE: {
      let supportSystemMessages = state.supportSystemMessages;

      if (action.payload.status) {
        supportSystemMessages.unshift(action.payload.data);
        success({
          title: action.payload.msg,
        });
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      return {
        ...state,
        supportSystemMessages: [...supportSystemMessages],
      };
    }

    case GET_SUPPORT_SYSTEM_MESSAGE: {
      return {
        ...state,
        supportSystemMessages: action.payload,
      };
    }

    case GET_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION: {
      return {
        ...state,
        supportSystemMessagesNotifications: action.payload,
      };
    }

    case GET_RECEIVED_SUPPORT_SYSTEM_MESSAGES: {
      return {
        ...state,
        receivedSupportSystemMessages: action.payload,
      };
    }

    case SYSTEM_SUPPORT_MESSAGE_RECEIVED: {
      let receivedSupportSystemMessagesList = state.receivedSupportSystemMessages;
      success({
        title: action.payload.msg
      });
      return {
        ...state,
        receivedSupportSystemMessages: [action.payload.data, ...receivedSupportSystemMessagesList]
      }
    }

    case UPDATE_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION: {

      return {
        ...state,
      };
    }
    case ADD_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION: {
      let supportSystemMessagesNotifications = state.supportSystemMessagesNotifications;

      if (action.payload.status) {
        supportSystemMessagesNotifications.unshift(action.payload.data);

      }
      return {
        ...state,
        supportSystemMessagesNotifications: [...supportSystemMessagesNotifications]
      };
    }

    default:
      return state;

  }
}
