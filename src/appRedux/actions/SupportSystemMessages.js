import {
  GENERATE_SYSTEM_MESSAGE,
  INVALID_TOKEN,
  SPIN_lOADING
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';


export function generateSupportSystemMessages(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateSupportSystemMessages(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GENERATE_SYSTEM_MESSAGE,
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
