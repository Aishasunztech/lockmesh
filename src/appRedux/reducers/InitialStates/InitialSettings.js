import enLang from "../../../lngProvider/locales/en_US";
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




export const initialSettings = {
    navCollapsed: true,
    navStyle: NAV_STYLE_FIXED,
    layoutType: LAYOUT_TYPE_FULL,
    themeType: THEME_TYPE_SEMI_DARK,
    colorSelection: THEME_COLOR_SELECTION_PRESET,
  
    pathname: '',
    width: window.innerWidth,
    isDirectionRTL: false,
    languages: [],
    translation: enLang,
    isSwitched: 'abc',
    //  locale: {
    //   languageId: 'english',
    //   locale: 'en',
    //   name: 'English',
    //   icon: 'us',
    // },
  };
