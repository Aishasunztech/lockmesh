import {
  SEND_SUPPORT_LIVE_CHAT_MESSAGE,
  INVALID_TOKEN,
  SPIN_lOADING, GET_SUPPORT_LIVE_CHAT_CONVERSATION,
  GET_SUPPORT_LIVE_CHAT_MESSAGES
} from "../../constants/ActionTypes";
import { Modal } from 'antd';
import RestService from '../services/RestServices';
const error = Modal.error;

export function sendSupportLiveChatMessage(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.sendSupportLiveChatMessage(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        if(response.data.status){
          dispatch({
            type: SEND_SUPPORT_LIVE_CHAT_MESSAGE,
            payload: response.data
          });
        } else {
          error({
            title: response.data.msg
          });
        }
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}


export function getSupportLiveChatConversation(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.getSupportLiveChatConversation(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GET_SUPPORT_LIVE_CHAT_CONVERSATION,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}


export function getSupportLiveChatMessages(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.getSupportLiveChatMessages(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GET_SUPPORT_LIVE_CHAT_MESSAGES,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}
