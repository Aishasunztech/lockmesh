import {
  PRODUCT_REPORT,
  HARDWARE_REPORT,
  INVOICE_REPORT,
  PAYMENT_HISTORY_REPORT,
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
          type: PRODUCT_REPORT,
          payload: response.data,
          productType: data.product
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}



export function generateInvoiceReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
      spinloading: true
    });

    RestService.generateInvoiceReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: INVOICE_REPORT,
          payload: response.data,
          productType: data.product
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}

export function generatePaymentHistoryReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
      spinloading: true
    });

    RestService.generatePaymentHistoryReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: PAYMENT_HISTORY_REPORT,
          payload: response.data,
          productType: data.product
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}

export function generateHardwareReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
      spinloading: true
    });

    RestService.generateHardwareReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: HARDWARE_REPORT,
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