import {
  SEND_SUPPORT_LIVE_MESSAGE,
  LOADING
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportLiveChatMessages: [],
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case SEND_SUPPORT_LIVE_MESSAGE:{
      let supportLiveChatMessages = state.supportLiveChatMessages;

      if (action.payload.status) {
        supportLiveChatMessages.push(action.payload.data);
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
        supportLiveChatMessages: [...supportLiveChatMessages],
      };
    }

    default:
      return state;

  }
}
