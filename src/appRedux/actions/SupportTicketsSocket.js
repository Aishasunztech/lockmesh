//==========> Connect Device events

import {GENERATE_SUPPORT_TICKET} from "../../constants/ActionTypes";

export const generateSupportTicketEvent = (socket) => {

  return (dispatch) => {
    if (socket && socket._callbacks['$' + GENERATE_SUPPORT_TICKET] == undefined) {

      socket.on(GENERATE_SUPPORT_TICKET, (response) => {

        dispatch({
          type: GENERATE_SUPPORT_TICKET,
          payload: response
        })
      })
    }
  }
};
