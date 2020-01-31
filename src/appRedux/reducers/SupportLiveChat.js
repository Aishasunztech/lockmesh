import {
  SEND_SUPPORT_LIVE_CHAT_MESSAGE, SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED,
  LOADING, GET_SUPPORT_LIVE_CHAT_CONVERSATION, GET_SUPPORT_LIVE_CHAT_MESSAGES,
  SUPPORT_LIVE_CHAT_USER_TYPING, SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING,
  SUPPORT_LIVE_CHAT_MESSAGE_DELETED, SUPPORT_LIVE_CHAT_CONVERSATION_DELETED
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportLiveChatMessages: [],
  supportLiveChatConversations: [],
  typingConversations: []
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
      let supportLiveChatConversations = state.supportLiveChatConversations;

      if(!supportLiveChatConversations.some(conversation => conversation._id === action.payload.conversation._id)){
        supportLiveChatConversations.push(action.payload.conversation);
      }

      if (action.payload.status) {
        supportLiveChatMessages.push(action.payload.message);
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      return {
        ...state,
        supportLiveChatMessages: [...supportLiveChatMessages],
        supportLiveChatConversations: [...supportLiveChatConversations]
      };
    }

    case SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED: {
      let supportLiveChatMessages = state.supportLiveChatMessages;
      let supportLiveChatConversations = state.supportLiveChatConversations.filter(conversation => conversation._id !== action.payload.conversation._id);

      // if(!supportLiveChatConversations.some(conversation => conversation._id === action.payload.conversation._id)){
      //   supportLiveChatConversations.push(action.payload.conversation);
      // }

      return {
        ...state,
        supportLiveChatMessages: [...supportLiveChatMessages, action.payload.message],
        supportLiveChatConversations: [action.payload.conversation, ...supportLiveChatConversations]
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

    case SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING:
      let typingConversations = state.typingConversations.filter(item => item !== action.payload);
      return {
        ...state,
        typingConversations
      };

    case SUPPORT_LIVE_CHAT_USER_TYPING:
      let typings = state.typingConversations;
      typings = typings.filter(item => item !== action.payload);
      typings.push(action.payload);
      return {
        ...state,
        typingConversations: typings
      };

    // case SUPPORT_LIVE_CHAT_MESSAGE_DELETED:
    //   let supportLiveChatConversations = state.supportLiveChatConversations.filter(conv => conv._id !== action.payload);
    //
    //   return {
    //     ...state,
    //     supportLiveChatConversations: supportLiveChatConversations
    //   };

    // case SUPPORT_LIVE_CHAT_CONVERSATION_DELETED:
    //   let supportLiveChatConversations = state.supportLiveChatConversations.filter(conv => conv._id !== action.payload);
    //
    //   return {
    //     ...state,
    //     supportLiveChatConversations: supportLiveChatConversations
    //   };

    default:
      return state;

  }
}
