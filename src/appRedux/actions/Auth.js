import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  LOGIN_USER_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_USER_SUCCESS,
  COMPONENT_ALLOWED,
  INVALID_TOKEN,
  INVALID_RESPONSE,
  UPDATE_PROFILE,
  BEFORE_COMPONENT_ALLOWED,
  TWO_FACTOR_AUTH
  // ACCESS_DENIED
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';


export const loginUser = (user) => {

  return (dispatch) => {

    RestService.login(user).then((resp) => {
      if (resp.data.status === false) {
        dispatch({
          type: LOGIN_FAILED,
          payload: {
            msg: resp.data.msg,
            status: resp.data.status
          }
        });
      } else {
        // console.log('dealer auth', resp);
        let payload = {
          id: resp.data.user.id,
          connected_dealer: resp.data.user.connected_dealer,
          connected_devices: resp.data.user.connected_devices[0].total,
          email: resp.data.user.email,
          dealerId: resp.data.user.id,
          firstName: resp.data.user.firstName,
          lastName: resp.data.user.lastName,
          name: resp.data.user.dealer_name,
          token: resp.data.token,
          type: resp.data.user.user_type,
          dealer_pin: resp.data.user.link_code,
          dealer_token: resp.data.user.token,
          two_factor_auth: resp.data.user.two_factor_auth
        }
        RestService.authLogIn(resp.data)
        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: payload
        });
      }
    });
  }
};

export const twoFactorAuth = (isEnable)=>{
  return (dispatch) => {
    RestService.twoFactorAuth(isEnable).then((response) => {
      if(RestService.checkAuth(response.data)){
        dispatch({
          type: TWO_FACTOR_AUTH,
          payload: response.data
        })

      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  }
}
export const checkComponent = (componentUri) => {
  return (dispatch) => {
    dispatch({
      type: BEFORE_COMPONENT_ALLOWED,
      payload: false,
    })

    RestService.checkComponent(componentUri).then((resp) => {
      if (RestService.checkAuth(resp.data)) {
        if (resp.data.status === true) {

          let payload = {
            id: resp.data.user.id,
            connected_dealer: resp.data.user.connected_dealer,
             connected_devices: resp.data.user.connected_devices[0].total,
            email: resp.data.user.email,
            dealerId: resp.data.user.id,
            firstName: resp.data.user.firstName,
            lastName: resp.data.user.lastName,
            name: resp.data.user.dealer_name,
            // token: resp.data.token,
            type: resp.data.user.user_type,
            dealer_pin: resp.data.user.link_code,
            two_factor_auth: resp.data.user.two_factor_auth
          }
          RestService.setUserData(resp.data);

          dispatch({
            type: COMPONENT_ALLOWED,
            payload: {
              ComponentAllowed: resp.data.ComponentAllowed,
              ...payload
            }
          });

        } else {
          dispatch({
            type: INVALID_TOKEN
          });
        }
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  }
};


export const updateUserProfile = (fromData) => {
  return (dispatch) => {
    // alert("hello");
    RestService.updateUserProfile(fromData).then((resp) => {
      if (RestService.checkAuth(resp.data)) {
        if (resp.data.status === true) {
          
          dispatch({
            type: UPDATE_PROFILE,
            response: resp.data
          });

        } else {
          dispatch({
            type: INVALID_RESPONSE
          });
        }
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  }
};

export const logout = () => {
  RestService.authLogOut();
  return {
    type: LOGOUT_USER_SUCCESS
  };
};


export const loginSuccess = (authUser) => {
  
};

export const logoutSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
  }
};

export const showAuthMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER,
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER,
  };
};
