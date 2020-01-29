import {
  INVALID_TOKEN, NEW_REQUEST_LIST, REJECT_REQUEST, ACCEPT_REQUEST, USER_CREDITS, GET_CANCEL_REQUEST,
  ACCEPT_SERVICE_REQUEST, REJECT_SERVICES_REQUEST, NEW_NOTIFICATION_LIST, WINDOW_WIDTH, SET_ADMIN_FOR_SUPPORT_TICKETS,
  UPDATE_TICKET_NOTIFICATION_STATUS, SPIN_lOADING, SET_SUPPORT_PAGE, RESET_SUPPORT_PAGE
} from "../../constants/ActionTypes"

import RestService from '../services/RestServices';

export function getNewCashRequests() {

    return (dispatch) => {

        RestService.getNewCashRequests().then((response) => {
            //  console.log("data form server");
            //  console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: NEW_REQUEST_LIST,
                        payload: response.data.data,
                        response: response.data,

                    });
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}
export function getTicketsNotifications() {

    return (dispatch) => {

        RestService.getTicketsNotifications().then((response) => {
          if (RestService.checkAuth(response.data)) {

                if (response.data.status) {
                    dispatch({
                        type: NEW_NOTIFICATION_LIST,
                        payload: response.data
                    });
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}
export function getUserCredit() {

    return (dispatch) => {

        RestService.getUserCredit().then((response) => {
            //  console.log("data form server");
            //  console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: USER_CREDITS,
                        payload: response.data.data,
                        response: response.data,

                    });
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}
export function rejectRequest(request) {
    return (dispatch) => {
        console.log(request, 'reject request called')
        RestService.rejectRequest(request).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: REJECT_REQUEST,
                    response: response.data,
                    request: request,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function acceptRequest(request) {
    return (dispatch) => {
        console.log(request)
        RestService.acceptRequest(request).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: ACCEPT_REQUEST,
                    response: response.data,
                    request: request,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function rejectServiceRequest(request) {
    return (dispatch) => {
        console.log(request, 'reject request called')
        RestService.rejectServiceRequest(request).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: REJECT_SERVICES_REQUEST,
                    response: response.data,
                    request: request,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function acceptServiceRequest(request) {
    return (dispatch) => {
        // console.log(request)
        RestService.acceptServiceRequest(request).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: ACCEPT_SERVICE_REQUEST,
                    response: response.data,
                    request: request,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function getCancelServiceRequests() {
    return (dispatch) => {
        RestService.getCancelServiceRequests().then((response) => {
            if (RestService.checkAuth(response.data)) {
                console.log(response.data.status);
                if (response.data.status) {
                    dispatch({
                        type: GET_CANCEL_REQUEST,
                        response: response.data,
                    })
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function getAdmin(){
  return (dispatch) => {
    RestService.getAdmin().then((response) => {
      if(RestService.checkAuth( response.data )){
        dispatch({
          type: SET_ADMIN_FOR_SUPPORT_TICKETS,
          payload: response.data
        })
      } else {
        dispatch({
          type: INVALID_TOKEN
        })
      }
    });
  }
}

export function updateTicketNotifications(data){
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING
    });

    RestService.updateTicketNotificationStatus(data).then(response => {
      if(response.status && response.data.success){
        dispatch({
          type: UPDATE_TICKET_NOTIFICATION_STATUS,
          payload: response.data
        });
      }
    })
  }
}

export function setSupportPage(page){
  return (dispatch) => {
    dispatch({
      type: SET_SUPPORT_PAGE,
      payload: page
    });
  }
}

export function resetSupportPage(){
  return (dispatch) => {
    dispatch({
      type: RESET_SUPPORT_PAGE
    });
  }
}
