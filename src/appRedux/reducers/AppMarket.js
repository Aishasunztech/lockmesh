import {
    TRANSFER_APPS,
    GET_MARKET_APPS
} from "constants/ActionTypes";

import {
    APK_SHOW_ON_DEVICE,
    APK,
    APK_APP_NAME,
    APK_APP_LOGO
} from '../../constants/ApkConstants';
import { message } from 'antd';
import { DEALERS_LIST } from "../../constants/ActionTypes";

const initialState = {
    isloading: false,
    apk_list: [],
    secureMarketList: [],
    availbleAppList: []
    // options: ['SHOW ON DEVICE', 'APK', 'APP NAME', 'APP LOGO']
};

export default (state = initialState, action) => {

    switch (action.type) {
        case TRANSFER_APPS:
            if (action.status) {
                message.success("Apps Transfered Successfully");
            }
            return {
                ...state
            }
        case GET_MARKET_APPS:
            return {
                ...state,
                secureMarketList: action.payload.marketApplist,
                availbleAppList: action.payload.availableApps
            }

        default:
            return state;

    }
}