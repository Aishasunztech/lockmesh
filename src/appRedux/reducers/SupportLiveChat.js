import {
  SEND_SUPPORT_LIVE_CHAT_MESSAGE,
  LOADING, GET_SUPPORT_LIVE_CHAT_CONVERSATION, GET_SUPPORT_LIVE_CHAT_MESSAGES
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportLiveChatMessages: [],
  supportLiveChatConversations: [],
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case SEND_SUPPORT_LIVE_CHAT_MESSAGE:{
      let supportLiveChatMessages = state.supportLiveChatMessages;

      if (action.payload.status) {
        supportLiveChatMessages.push(action.payload.data);
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      return {
        ...state,
        supportLiveChatMessages: [...supportLiveChatMessages],
      };
    }

    case GET_SUPPORT_LIVE_CHAT_CONVERSATION:{
      return {
        ...state,
        supportLiveChatConversations: action.payload.data,
      };
    }

    case GET_SUPPORT_LIVE_CHAT_MESSAGES:{
      return {
        ...state,
        supportLiveChatMessages: action.payload.data,
      };
    }

    default:
      return state;

  }
}
