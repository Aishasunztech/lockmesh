//==========> Connect Device events

import { SYSTEM_SUPPORT_MESSAGE_RECEIVED } from "../../constants/ActionTypes";

export const systemMessageSocket = (socket) => {

  return (dispatch) => {
    if (socket && socket._callbacks['$' + SYSTEM_SUPPORT_MESSAGE_RECEIVED] == undefined) {

      socket.on(SYSTEM_SUPPORT_MESSAGE_RECEIVED, (response) => {

        dispatch({
          type: SYSTEM_SUPPORT_MESSAGE_RECEIVED,
          payload: response
        })
      })
    }
  }
};
