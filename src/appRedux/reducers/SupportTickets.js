import {
  GENERATE_SUPPORT_TICKET,
  SUPPORT_TICKET_REPLY,
  GET_SUPPORT_TICKET,
  LOADING,
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportTickets: []
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case GENERATE_SUPPORT_TICKET:{
      let tickets = state.supportTickets;

      if (action.payload.status) {
        tickets.unshift(action.payload.data);
        success({
          title: action.payload.msg,
        });
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      return {
        ...state,
        supportTickets: [...tickets],
      };
    }

    case SUPPORT_TICKET_REPLY:{
      if (action.payload.status) {

        success({
          title: action.payload.msg,
        });
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      return {
        ...state,
      };
    }

    case GET_SUPPORT_TICKET:{
      return {
        ...state,
        supportTickets: action.payload,
      };
    }

    default:
      return state;

  }
}
