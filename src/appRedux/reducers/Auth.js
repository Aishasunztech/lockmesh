import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  LOGIN_FAILED,
  INVALID_TOKEN,
  COMPONENT_ALLOWED,
  ACCESS_DENIED,
  UPDATE_PROFILE,
  BEFORE_COMPONENT_ALLOWED,
  TWO_FACTOR_AUTH,
  VERIFY_CODE,
  CODE_VERIFIED,
  GOTO_LOGIN
} from "../../constants/ActionTypes";
// import { stat } from "fs";
import RestService from '../services/RestServices';
import { message } from "antd";
import io from 'socket.io-client';

const INIT_STATE = {
  loader: false,
  alertMessage: '',
  showMessage: false,
  initURL: '',
  socket: io,
  isAllowed: false,
  isRequested: false,
  two_factor_auth: (localStorage.getItem('is_twoFactorAuth') === null) ? false : localStorage.getItem('is_twoFactorAuth'),
  authUser: {
    id: localStorage.getItem('id'),
    connected_devices: localStorage.getItem('connected_devices'),
    connected_dealer: localStorage.getItem('connected_dealer'),
    email: localStorage.getItem("email"),
    dealerId: localStorage.getItem("id"),
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
    name: localStorage.getItem("name"),
    token: localStorage.getItem("token"),
    type: localStorage.getItem("type"),
    dealer_pin: localStorage.getItem("dealer_pin"),
    two_factor_auth: localStorage.getItem('two_factor_auth') === null ? false : localStorage.getItem('two_factor_auth'),
    verified: false
  },
};


export default (state = INIT_STATE, action) => {

  switch (action.type) {
    case INIT_URL: {
      localStorage.removeItem('is_twoFactorAuth')
      state.two_factor_auth = false;
      return {
        ...state,
        initURL: action.payload,

      }
    }
    case GOTO_LOGIN: {
      return {
        ...state,
        initURL: '/login'
      }
    }
    case LOGIN_USER_SUCCESS: {

      return {
        ...state,
        loader: false,
        authUser: action.payload
      }
    }
    case VERIFY_CODE: {
      localStorage.setItem('is_twoFactorAuth', action.payload.two_factor_auth)
      message.success(action.payload.msg);
      return {
        ...state,
        two_factor_auth: action.payload.two_factor_auth
      }
    }
    case CODE_VERIFIED: {
      if (action.payload.status) {
        message.success(action.payload.msg);
        localStorage.removeItem('is_twoFactorAuth');
      } else {
        message.error(action.payload.msg);
      }
      state.authUser.verified = action.payload.verified;
      return {
        ...state,
      }
    }
    case BEFORE_COMPONENT_ALLOWED: {
      return {
        ...state,
        isRequested: action.payload
      }
    }
    case LOGIN_FAILED: {

      return {
        ...state,
        alertMessage: action.payload.msg,
        showMessage: true,
        loader: false
      }
    }

    case LOGOUT_USER_SUCCESS: {
      return {
        ...state,
        authUser: {
          id: null,
          connected_dealer: null,
          email: null,
          dealerId: null,
          firstName: null,
          lastName: null,
          name: null,
          token: null,
          type: null,
          two_factor_auth: null
        },
        initURL: '/',
        loader: false,
        two_factor_auth: false

      }
    }

    case UPDATE_PROFILE: {
      if (action.response.status) {
        state.authUser.name = action.response.data.name;
        localStorage.setItem('name', action.response.data.name);
        message.success(action.response.msg);
      }
      else {
        message.error(action.response.msg);
      }
      return {
        ...state,
        authUser: state.authUser,
        loader: false,

      }
    }

    case INVALID_TOKEN: {
      RestService.authLogOut();
      return {
        ...state,
        alertMessage: "Login expired",
        showMessage: true,
        authUser: {
          id: null,
          connected_dealer: null,
          email: null,
          dealerId: null,
          firstName: null,
          lastName: null,
          name: null,
          token: null,
          type: null,
          two_factor_auth: null
        },
        initURL: '/',
        loader: false
      }
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false
      }
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false,
        loader: false
      }
    }

    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true
      }
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false
      }
    }
    case COMPONENT_ALLOWED: {
      let socket = RestService.connectSocket(state.authUser.token);

      return {
        ...state,
        isAllowed: action.payload.ComponentAllowed,
        isRequested: true,
        socket: socket,
        authUser: {
          id: action.payload.id,
          connected_dealer: action.payload.connected_dealer,
          connected_devices: action.payload.connected_devices,
          email: action.payload.email,
          dealerId: action.payload.dealerId,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          name: action.payload.name,
          type: action.payload.type,
          dealer_pin: action.payload.dealer_pin,
          two_factor_auth: action.payload.two_factor_auth,
          verified: action.payload.verified
        }
      }
      break;
    }
    case ACCESS_DENIED: {
      return {
        ...state,
        initURL: '/invalid_page'
      }
      break;
    }
    case TWO_FACTOR_AUTH: {
      if (action.payload.status) {
        message.success(action.payload.msg)
        state.authUser.two_factor_auth = action.payload.isEnable
      } else {
        message.error(action.payload.msg)
      }
      return {
        ...state
      }
    }
    default:
      return state;
  }
}
