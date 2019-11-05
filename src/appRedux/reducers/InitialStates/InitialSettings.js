import {
  LAYOUT_TYPE,
  LAYOUT_TYPE_FULL,
  NAV_STYLE,
  NAV_STYLE_FIXED,
  THEME_COLOR_SELECTION,
  THEME_COLOR_SELECTION_PRESET,
  THEME_TYPE,
  THEME_TYPE_SEMI_DARK,

} from "../../../constants/ThemeSetting";
// import { convertToLang } from '../../../routes/utils/commonUtils';

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
  DEVICE_TYPE,
  DEVICE_VERSION,
  DEVICE_TRANSFERED,
  DEVICE_LASTONLINE,
  DEVICE_FIRMWAREINFO,
} from '../../../constants/DeviceConstants';

import {
  DEALER_ID,
  DEALER_NAME,
  DEALER_EMAIL,
  DEALER_PIN,
  DEALER_DEVICES,
  DEALER_TOKENS,
  Parent_Dealer,
  Parent_Dealer_ID
} from '../../../constants/DealerConstants';

import {
  APK_SHOW_ON_DEVICE,
  APK,
  APK_APP_NAME,
  APK_APP_LOGO,
  APK_PERMISSION,
  APK_SIZE
} from '../../../constants/ApkConstants';

export var initialSettings = {
  navCollapsed: true,
  navStyle: NAV_STYLE_FIXED,
  layoutType: LAYOUT_TYPE_FULL,
  themeType: THEME_TYPE_SEMI_DARK,
  colorSelection: THEME_COLOR_SELECTION_PRESET,

  pathname: '',
  width: window.innerWidth,
  isDirectionRTL: false,
  languages: [],
  translation: {},
  isSwitched: 'abc',
  deviceOptions: [
    { "key": "device_id", "value": DEVICE_ID },
    { "key": "user_id", "value": USER_ID },
    { "key": "validity", "value": DEVICE_REMAINING_DAYS },
    { "key": "status", "value": DEVICE_STATUS },
    { "key": "lastOnline", "value": DEVICE_LASTONLINE },
    { "key": "online", "value": DEVICE_MODE },
    { "key": "type", "value": DEVICE_TYPE },
    { "key": "version", "value": DEVICE_VERSION },
    { "key": "firmware_info", "value": DEVICE_FIRMWAREINFO },
    { "key": "flagged", "value": DEVICE_FLAGGED },
    { "key": "transfered_to", "value": DEVICE_TRANSFERED },
    { "key": "name", "value": DEVICE_NAME },
    { "key": "account_email", "value": DEVICE_ACCOUNT_EMAIL },
    { "key": "client_id", "value": DEVICE_CLIENT_ID },
    { "key": "activation_code", "value": DEVICE_ACTIVATION_CODE },
    { "key": "pgp_email", "value": DEVICE_PGP_EMAIL },
    { "key": "sim_id", "value": DEVICE_SIM_ID },
    { "key": "sim_id2", "value": "SIM ID 2" },
    { "key": "chat_id", "value": DEVICE_CHAT_ID },
    { "key": "dealer_id", "value": DEVICE_DEALER_ID },
    { "key": "dealer_name", "value": DEVICE_DEALER_NAME },
    { "key": "dealer_pin", "value": DEVICE_DEALER_PIN },
    { "key": "mac_address", "value": DEVICE_MAC_ADDRESS },
    { "key": "imei_1", "value": DEVICE_IMEI_1 },
    { "key": "sim_1", "value": DEVICE_SIM_1 },
    { "key": "imei_2", "value": DEVICE_IMEI_2 },
    { "key": "sim_2", "value": DEVICE_SIM_2 },
    { "key": "serial_number", "value": DEVICE_SERIAL_NUMBER },
    { "key": "model", "value": DEVICE_MODEL },
    { "key": "s_dealer", "value": DEVICE_S_DEALER },
    { "key": "s_dealer_name", "value": DEVICE_S_DEALER_NAME },
    { "key": "remainTermDays", "value": "REMAINING TERM DAYS" },
    { "key": "start_date", "value": DEVICE_START_DATE },
    { "key": "expiry_date", "value": DEVICE_EXPIRY_DATE },
  ],
  dealerOptions: [
    { "key": "dealer_id", "value": DEALER_ID },
    { "key": "dealer_name", "value": DEALER_NAME },
    { "key": "dealer_email", "value": DEALER_EMAIL },
    { "key": "link_code", "value": DEALER_PIN },
    { "key": "connected_devices", "value": DEALER_DEVICES },
    { "key": "dealer_token", "value": DEALER_TOKENS },
    { "key": "parent_dealer", "value": Parent_Dealer },
    { "key": "parent_dealer_id", "value": Parent_Dealer_ID },
  ],
  APKOptions: [
    { "key": "permission", "value": APK_PERMISSION },
    { "key": "apk_status", "value": APK_SHOW_ON_DEVICE },
    { "key": "apk", "value": APK },
    { "key": "apk_name", "value": APK_APP_NAME },
    { "key": "apk_logo", "value": APK_APP_LOGO },
    { "key": "apk_size", "value": APK_SIZE },
    { "key": "label", "value": "LABEL" },
    { "key": "package_name", "value": "PACKAGE NAME" },
    { "key": "version", "value": "VERSION" },
    { "key": "created_at", "value": "UPLOAD DATE" },
    { "key": "updated_at", "value": "EDIT DATE" },
  ],
  //  locale: {
  //   languageId: 'english',
  //   locale: 'en',
  //   name: 'English',
  //   icon: 'us',
  // },
};
