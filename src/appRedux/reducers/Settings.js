import { LANGUAGES, SWITCH_LANGUAGE, TOGGLE_COLLAPSED_NAV, WINDOW_WIDTH, GET_LANGUAGE } from "../../constants/ActionTypes";
import {
  LAYOUT_TYPE,
  LAYOUT_TYPE_FULL,
  NAV_STYLE,
  NAV_STYLE_FIXED,
  THEME_COLOR_SELECTION,
  THEME_COLOR_SELECTION_PRESET,
  THEME_TYPE,
  THEME_TYPE_SEMI_DARK,

} from "../../constants/ThemeSetting";

// import constants from '../constants';

import SettingStates from './InitialStates';
const { initialSettings } = SettingStates;
// import enLang from "../../lngProvider/locales/en_US";


// const initialSettings = {
//   navCollapsed: true,
//   navStyle: NAV_STYLE_FIXED,
//   layoutType: LAYOUT_TYPE_FULL,
//   themeType: THEME_TYPE_SEMI_DARK,
//   colorSelection: THEME_COLOR_SELECTION_PRESET,

//   pathname: '',
//   width: window.innerWidth,
//   isDirectionRTL: false,
//   languages: [],
//   translation: enLang,
//   isSwitched: 'abc',
//   //  locale: {
//   //   languageId: 'english',
//   //   locale: 'en',
//   //   name: 'English',
//   //   icon: 'us',
//   // },
// };

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      // console.log('@@router/LOCATION_CHANGE');
      // console.log({
      //   ...state,
      //   pathname: action.payload.pathname,
      //   navCollapsed: false
      // });

      return {
        ...state,
        pathname: action.payload.pathname,
        navCollapsed: false
      };
    case TOGGLE_COLLAPSED_NAV:
      // console.log(TOGGLE_COLLAPSED_NAV);
      // console.log({
      //   ...state,
      //   navCollapsed: action.navCollapsed
      // });

      return {
        ...state,
        navCollapsed: action.navCollapsed
      };
    case WINDOW_WIDTH:
      return {
        ...state,
        width: action.width,
      };

    case GET_LANGUAGE: {
      if (action.response.status && action.response.data.length) {
        console.log('GET_LANGUAGE response is the', action.response.data)
        console.log(JSON.parse(action.response.data));
        console.log('GET_LANGUAGE2 response is the', state.translation)
        return {
          ...state,
          // locale: action.response.data[0] ? JSON.parse(action.response.data[0]['dealer_language']) : state.locale
        translation: action.response.data ? JSON.parse(action.response.data) : state.translation
        }
      }
    }
    case THEME_TYPE:
      return {
        ...state,
        themeType: action.themeType
      };
    case THEME_COLOR_SELECTION:
      return {
        ...state,
        colorSelection: action.colorSelection
      };

    case NAV_STYLE:
      return {
        ...state,
        navStyle: action.navStyle
      };
    case LAYOUT_TYPE:
      return {
        ...state,
        layoutType: action.layoutType
      };

    case SWITCH_LANGUAGE:
      // console.log('isSwitched working')
      return {
        ...state,
        isSwitched: new Date()
        // locale: action.payload,
      };
    case LANGUAGES:
      // console.log('All Languages are: ', action.payload);
      return {
        ...state,
        languages: action.payload,
      };
    default:
      // console.log("default Setting reducer");
      // console.log(state);
      return state;
  }
};

export default settings;
