import {
  PRODUCT_REPORT,
  INVOICE_REPORT,
  PAYMENT_HISTORY_REPORT,
  LOADING,
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';

const initialState = {
  isloading: true,
  productData: {},
  invoiceData: {},
  paymentHistoryData: {},
  productType:""
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case PRODUCT_REPORT:

      return {
        ...state,
        productData: action.payload.data,
        productType: action.productType
      };

    case INVOICE_REPORT:
      return {
        ...state,
        invoiceData: action.payload.data
      };

    case PAYMENT_HISTORY_REPORT:
      return {
        ...state,
        paymentHistoryData: action.payload.data
      };

    default:
      return state;

  }
}
