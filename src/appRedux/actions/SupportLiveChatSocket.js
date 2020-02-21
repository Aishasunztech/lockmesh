//==========> Connect Device events

import { SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED, SUPPORT_LIVE_CHAT_USER_TYPING, SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING, SUPPORT_LIVE_CHAT_MESSAGE_DELETED, SUPPORT_LIVE_CHAT_CONVERSATION_DELETED, SUPPORT_LIVE_CHAT_NOTIFICATION_NEW_MESSAGE } from "../../constants/ActionTypes";

export const supportLiveChatSocket = (socket) => {

  return (dispatch) => {
    if (socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED] == undefined) {

      socket.on(SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED, (response) => {
        dispatch({
          type: SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED,
          payload: response
        });

        dispatch({
          type: SUPPORT_LIVE_CHAT_NOTIFICATION_NEW_MESSAGE,
          payload: response.message
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

    // if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_MESSAGE_DELETED] == undefined){
    //   socket.on(SUPPORT_LIVE_CHAT_MESSAGE_DELETED, (data) => {
    //     dispatch({
    //       type: SUPPORT_LIVE_CHAT_MESSAGE_DELETED,
    //       payload: data
    //     })
    //   })
    // }
    //
    // if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_CONVERSATION_DELETED] == undefined){
    //   socket.on(SUPPORT_LIVE_CHAT_CONVERSATION_DELETED, (data) => {
    //     dispatch({
    //       type: SUPPORT_LIVE_CHAT_CONVERSATION_DELETED,
    //       payload: data
    //     })
    //   })
    // }
  }
};
