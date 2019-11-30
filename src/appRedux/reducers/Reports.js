import {
  PRODUCT_REPORT,
  HARDWARE_REPORT,
  INVOICE_REPORT,
  PAYMENT_HISTORY_REPORT,
  SALES_REPORT,
  GRACE_DAYS_REPORT,
  LOADING,
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success
const error = Modal.error

const initialState = {
  isloading: true,
  productData: {},
  hardwareData: {},
  invoiceData: {},
  paymentHistoryData: {},
  graceDaysReportData: {},
  salesData: {},
  saleInfo: {},
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
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        productData: action.payload.data,
        productType: action.productType
      };

    case INVOICE_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        invoiceData: action.payload.data
      };

    case PAYMENT_HISTORY_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        paymentHistoryData: action.payload.data
      };

    case HARDWARE_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        hardwareData: action.payload.data
      };

    case SALES_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        salesData: action.payload.data,
        saleInfo: action.payload.saleInfo,
      };

    case GRACE_DAYS_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        graceDaysReportData: action.payload.data,
      };

    default:
      return state;

  }
}
