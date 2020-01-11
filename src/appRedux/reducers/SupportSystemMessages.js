import {
  GENERATE_SYSTEM_MESSAGE,
  LOADING
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportSystemMessages: [],
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case GENERATE_SYSTEM_MESSAGE:{
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

    default:
      return state;

  }
}
