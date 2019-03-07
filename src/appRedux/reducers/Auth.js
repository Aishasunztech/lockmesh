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
  UPDATE_PROFILE
} from "constants/ActionTypes";
// import { stat } from "fs";
import RestService from '../services/RestServices';
import { message } from "antd";

const INIT_STATE = {
  loader: false,
  alertMessage: '',
  showMessage: false,
  initURL: '',

  isAllowed: false,

  authUser: {
    id: localStorage.getItem('id'),
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
  // console.log("auth.js");
  // console.log("states");
  // console.log("auth user state");
  // console.log(state.authUser);
  // console.log("actions");
  // console.log(action.type);

  switch (action.type) {

    case LOGIN_USER_SUCCESS: {
      // console.log("logged in");
      return {
        ...state,
        loader: false,
        authUser: action.payload
      }
    }
    case LOGIN_FAILED: {
      // console.log({
      //   ...state,
      //   alertMessage: action.payload.msg,
      //   showMessage: true,
      //   loader: false
      // });

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
        message.success(action.response.msg);
        state.authUser.firstName = action.response.data.first_Name;
        state.authUser.lastName = action.response.data.Last_Name;
        localStorage.setItem('firstName', action.response.data.first_Name);
        localStorage.setItem('lastName', action.response.data.Last_Name);

        // console.log('user detail',action.response);
        // console.log('user state',state.authUser);

      }
      else {
        message.error(action.response.msg);
      }
      return {
        ...state,

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
        isAllowed: action.payload
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
