import {
  GENERATE_SUPPORT_TICKET,
  SUPPORT_TICKET_REPLY,
  GET_SUPPORT_TICKET_REPLY,
  GET_SUPPORT_TICKET,
  CLOSE_SUPPORT_TICKET,
  DELETE_SUPPORT_TICKET,
  LOADING, GENERATE_SUPPORT_TICKET_SOCKET,
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportTickets: [],
  ticketReply: [],
  closeSupportTicketStatus: false,
  supportTicketReplies: [],
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

    case GENERATE_SUPPORT_TICKET_SOCKET:{
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
      let replies = state.supportTicketReplies;
      if (action.payload.status) {
        replies = action.payload.data;
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
        supportTicketReplies: [...replies],
      };
    }

    case GET_SUPPORT_TICKET:{
      return {
        ...state,
        supportTickets: action.payload,
      };
    }

    case GET_SUPPORT_TICKET_REPLY:{

      return {
        ...state,
        supportTicketReplies: action.payload.data,
      };
    }

    case CLOSE_SUPPORT_TICKET:{
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
        closeSupportTicketStatus: action.payload.status
      };
    }

    case DELETE_SUPPORT_TICKET:{
      let updatedTickets    = [];
      if (action.payload.status) {
        let deletedIds        = action.payload.deletedIds;
        updatedTickets        = state.supportTickets.filter(supportTicket => !deletedIds.includes(supportTicket._id));
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
        supportTickets: [...updatedTickets]
      };
    }

    default:
      return state;

  }
}