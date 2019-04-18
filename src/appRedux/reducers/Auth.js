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
  BEFORE_COMPONENT_ALLOWED
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
  isRequested:false,
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
    dealer_pin: localStorage.getItem("dealer_pin")
  },
};


export default (state = INIT_STATE, action) => {

  switch (action.type) {

    case LOGIN_USER_SUCCESS: {
      let socket = RestService.connectSocket(action.payload.token);
      return {
        ...state,
        loader: false,
        socket: socket,
        authUser: action.payload
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
    case INIT_URL: {
      return {
        ...state,
        initURL: action.payload
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
          type: null
        },
        initURL: '/',
        loader: false
      }
    }

    case UPDATE_PROFILE: {
      if (action.response.status) {
        state.authUser.name = action.response.data.name;
        localStorage.setItem('name', action.response.data.name);
        message.success(action.response.msg);
        // console.log('user detail',action.response);
        // console.log('user state',state.authUser);
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
      break;

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
          type: null
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
      // console.log("dsfsdfsdf",action.payload)
      return {
        ...state,
        isAllowed: action.payload.ComponentAllowed,
        isRequested: true,
        authUser:{
          id: action.payload.id,
          connected_dealer: action.payload.connected_dealer,
          connected_devices: action.payload.connected_devices,
          email: action.payload.email,
          dealerId: action.payload.dealerId,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          name: action.payload.name,
          type: action.payload.type,
          dealer_pin: action.payload.dealer_pin
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
    default:
      return state;
  }
}
