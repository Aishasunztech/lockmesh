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
import {
  DEVICE_ID,
  USER_ID,
  DEVICE_REMAINING_DAYS,
  DEVICE_FLAGGED,
  DEVICE_STATUS,
  DEVICE_MODE,
  DEVICE_NAME,
  DEVICE_ACTIVATION_CODE,
  DEVICE_ACCOUNT_EMAIL,
  DEVICE_PGP_EMAIL,
  DEVICE_CHAT_ID,
  DEVICE_CLIENT_ID,
  DEVICE_DEALER_ID,
  DEVICE_DEALER_PIN,
  DEVICE_MAC_ADDRESS,
  DEVICE_SIM_ID,
  DEVICE_IMEI_1,
  DEVICE_SIM_1,
  DEVICE_IMEI_2,
  DEVICE_SIM_2,
  DEVICE_SERIAL_NUMBER,
  DEVICE_MODEL,
  DEVICE_START_DATE,
  DEVICE_EXPIRY_DATE,
  DEVICE_DEALER_NAME,
  DEVICE_S_DEALER,
  DEVICE_S_DEALER_NAME,
} from '../../constants/DeviceConstants';

import {
  DEALER_ID,
  DEALER_NAME,
  DEALER_EMAIL,
  DEALER_PIN,
  DEALER_DEVICES,
  DEALER_TOKENS,
  Parent_Dealer,
  Parent_Dealer_ID
} from '../../constants/DealerConstants';
import {
	APK_SHOW_ON_DEVICE,
	APK,
	APK_APP_NAME,
	APK_APP_LOGO,
	APK_PERMISSION
} from '../../constants/ApkConstants';
// import constants from '../constants';

import SettingStates from './InitialStates';

import { convertToLang } from '../../routes/utils/commonUtils';

var { initialSettings } = SettingStates;

var { translation } = SettingStates;
// import enLang from "../../lngProvider/locales/en_US";

// initialSettings.
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
  // console.log('Ubaid at red. ', initialSettings.translation)
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
        // console.log('GET_LANGUAGE response is the', action.response.data)
        // console.log(JSON.parse(action.response.data));
        // console.log('GET_LANGUAGE2 response is the', state.translation)
        // initialSettings["translation"] = action.response.data ? JSON.parse(action.response.data) : state.translation
        let passedTranslation = action.response.data ? JSON.parse(action.response.data) : state.translation;
        return {
          ...state,
          // locale: action.response.data[0] ? JSON.parse(action.response.data[0]['dealer_language']) : state.locale
          translation: passedTranslation,
          deviceOptions: [
            { "key": DEVICE_ID, "value": convertToLang(passedTranslation[DEVICE_ID], DEVICE_ID) },
            { "key": USER_ID, "value": convertToLang(passedTranslation[USER_ID], USER_ID) },
            { "key": DEVICE_REMAINING_DAYS, "value": convertToLang(passedTranslation[DEVICE_REMAINING_DAYS], DEVICE_REMAINING_DAYS) },
            { "key": DEVICE_STATUS, "value": convertToLang(passedTranslation[DEVICE_STATUS], DEVICE_STATUS) },
            { "key": DEVICE_MODE, "value": convertToLang(passedTranslation[DEVICE_MODE], DEVICE_MODE) },
            { "key": DEVICE_FLAGGED, "value": convertToLang(passedTranslation[DEVICE_FLAGGED], DEVICE_FLAGGED) },
            { "key": DEVICE_NAME, "value": convertToLang(passedTranslation[DEVICE_NAME], DEVICE_NAME) },
            { "key": DEVICE_ACCOUNT_EMAIL, "value": convertToLang(passedTranslation[DEVICE_ACCOUNT_EMAIL], DEVICE_ACCOUNT_EMAIL) },
            { "key": DEVICE_CLIENT_ID, "value": convertToLang(passedTranslation[DEVICE_CLIENT_ID], DEVICE_CLIENT_ID) },
            { "key": DEVICE_ACTIVATION_CODE, "value": convertToLang(passedTranslation[DEVICE_ACTIVATION_CODE], DEVICE_ACTIVATION_CODE) },
            { "key": DEVICE_PGP_EMAIL, "value": convertToLang(passedTranslation[DEVICE_PGP_EMAIL], DEVICE_PGP_EMAIL) },
            { "key": DEVICE_SIM_ID, "value": convertToLang(passedTranslation[DEVICE_SIM_ID], DEVICE_SIM_ID) },
            { "key": DEVICE_CHAT_ID, "value": convertToLang(passedTranslation[DEVICE_CHAT_ID], DEVICE_CHAT_ID) },
            { "key": DEVICE_DEALER_ID, "value": convertToLang(passedTranslation[DEVICE_DEALER_ID], DEVICE_DEALER_ID) },
            { "key": DEVICE_DEALER_NAME, "value": convertToLang(passedTranslation[DEVICE_DEALER_NAME], DEVICE_DEALER_NAME) },
            { "key": DEVICE_DEALER_PIN, "value": convertToLang(passedTranslation[DEVICE_DEALER_PIN], DEVICE_DEALER_PIN) },
            { "key": DEVICE_MAC_ADDRESS, "value": convertToLang(passedTranslation[DEVICE_MAC_ADDRESS], DEVICE_MAC_ADDRESS) },
            { "key": DEVICE_IMEI_1, "value": convertToLang(passedTranslation[DEVICE_IMEI_1], DEVICE_IMEI_1) },
            { "key": DEVICE_SIM_1, "value": convertToLang(passedTranslation[DEVICE_SIM_1], DEVICE_SIM_1) },
            { "key": DEVICE_IMEI_2, "value": convertToLang(passedTranslation[DEVICE_IMEI_2], DEVICE_IMEI_2) },
            { "key": DEVICE_SIM_2, "value": convertToLang(passedTranslation[DEVICE_SIM_2], DEVICE_SIM_2) },
            { "key": DEVICE_SERIAL_NUMBER, "value": convertToLang(passedTranslation[DEVICE_SERIAL_NUMBER], DEVICE_SERIAL_NUMBER) },
            { "key": DEVICE_MODEL, "value": convertToLang(passedTranslation[DEVICE_MODEL], DEVICE_MODEL) },
            { "key": DEVICE_S_DEALER, "value": convertToLang(passedTranslation[DEVICE_S_DEALER], DEVICE_S_DEALER) },
            { "key": DEVICE_S_DEALER_NAME, "value": convertToLang(passedTranslation[DEVICE_S_DEALER_NAME], DEVICE_S_DEALER_NAME) },
            { "key": DEVICE_START_DATE, "value": convertToLang(passedTranslation[DEVICE_START_DATE], DEVICE_START_DATE) },
            { "key": DEVICE_EXPIRY_DATE, "value": convertToLang(passedTranslation[DEVICE_EXPIRY_DATE], DEVICE_EXPIRY_DATE) },
          ],
          dealerOptions: [
            { "key": DEALER_ID, "value": convertToLang(passedTranslation[DEALER_ID], DEALER_ID) },
            { "key": DEALER_NAME, "value": convertToLang(passedTranslation[DEALER_NAME], DEALER_NAME) },
            { "key": DEALER_EMAIL, "value": convertToLang(passedTranslation[DEALER_EMAIL], DEALER_EMAIL) },
            { "key": DEALER_PIN, "value": convertToLang(passedTranslation[DEALER_PIN], DEALER_PIN) },
            { "key": DEALER_DEVICES, "value": convertToLang(passedTranslation[DEALER_DEVICES], DEALER_DEVICES) },
            { "key": DEALER_TOKENS, "value": convertToLang(passedTranslation[DEALER_TOKENS], DEALER_TOKENS) },
            { "key": Parent_Dealer, "value": convertToLang(passedTranslation[Parent_Dealer], Parent_Dealer) },
            { "key": Parent_Dealer_ID, "value": convertToLang(passedTranslation[Parent_Dealer_ID], Parent_Dealer_ID) },
          ],
          APKOptions: [
            { "key": APK_PERMISSION, "value": convertToLang(passedTranslation[APK_PERMISSION], APK_PERMISSION)},
            { "key": APK_SHOW_ON_DEVICE, "value": convertToLang(passedTranslation[APK_SHOW_ON_DEVICE], APK_SHOW_ON_DEVICE)},
            { "key": APK, "value": convertToLang(passedTranslation[APK], APK)},
            { "key": APK_APP_NAME, "value": convertToLang(passedTranslation[APK_APP_NAME], APK_APP_NAME)},
            { "key": APK_APP_LOGO, "value": convertToLang(passedTranslation[APK_APP_LOGO], APK_APP_LOGO)},
          ],
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
      return {
        ...state
      };
  }
};

export default settings;
