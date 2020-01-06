import {
  GENERATE_SUPPORT_TICKET,
  SUPPORT_TICKET_REPLY,
  CLOSE_SUPPORT_TICKET,
  GET_SUPPORT_TICKET,
  DELETE_SUPPORT_TICKET,
  GET_SUPPORT_TICKET_REPLY,
  INVALID_TOKEN,
  SPIN_lOADING
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';


export function generateSupportTicket(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateSupportTicket(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GENERATE_SUPPORT_TICKET,
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


export function supportTicketReply(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.supportTicketReply(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: SUPPORT_TICKET_REPLY,
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


export function getSupportTickets(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.getSupportTickets(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GET_SUPPORT_TICKET,
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


export function closeSupportTicket(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.closeSupportTicket(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: CLOSE_SUPPORT_TICKET,
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


export function deleteSupportTicket(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.deleteSupportTicket(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: DELETE_SUPPORT_TICKET,
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


export function getSupportTicketReplies(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.getSupportTicketReplies(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GET_SUPPORT_TICKET_REPLY,
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
