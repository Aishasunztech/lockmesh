import {
  PRODUCT_REPORTING,
  DEALERS_LIST,
  LOADING,
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';

const initialState = {
  isloading: true,
  data: ''
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case PRODUCT_REPORTING:

      return {
        ...state,
        spinloading: true,
      };

    case DEALERS_LIST:
      return {
        ...state,
        isloading: false,
        spinloading: false,
        dealers: action.payload,
        // options: state.options
      };

    default:
      return state;

  }
}
