import {
  SEND_SUPPORT_LIVE_MESSAGE,
  INVALID_TOKEN,
  SPIN_lOADING
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function sendSupportLiveChatMessage(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.sendSupportLiveChatMessage(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: SEND_SUPPORT_LIVE_MESSAGE,
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
