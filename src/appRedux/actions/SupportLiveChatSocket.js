//==========> Connect Device events

import { SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED, SUPPORT_LIVE_CHAT_USER_TYPING, SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING } from "../../constants/ActionTypes";

export const supportLiveChatSocket = (socket) => {

  return (dispatch) => {
    if (socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED] == undefined) {

      socket.on(SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED, (response) => {
        dispatch({
          type: SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED,
          payload: response
        });
      })
    }

    if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_USER_TYPING] == undefined){

      socket.on(SUPPORT_LIVE_CHAT_USER_TYPING, (data) => {
        dispatch({
          type: SUPPORT_LIVE_CHAT_USER_TYPING,
          payload: data
        })
      })
    }

    if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING] == undefined){
      socket.on(SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING, (data) => {
        dispatch({
          type: SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING,
          payload: data
        })
      })
    }
  }
};
