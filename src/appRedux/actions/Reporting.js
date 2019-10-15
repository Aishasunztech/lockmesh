import {
  PRODUCT_REPORTING,
  INVALID_TOKEN,
  SPIN_lOADING
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';


export function generateProductReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
      spinloading: true
    });

    RestService.generateProductReport(data).then((response) => {

      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: PRODUCT_REPORTING,
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
