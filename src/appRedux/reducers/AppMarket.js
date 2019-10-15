import {
    TRANSFER_APPS,
    GET_MARKET_APPS,
    LOADING,
    UNINSTALL_PERMISSION_CHANGED
} from "constants/ActionTypes";
import { message, Modal } from 'antd';
import { REMOVE_APPS } from "../../constants/ActionTypes";

const initialState = {
    isloading: false,
    apk_list: [],
    secureMarketList: [],
    availbleAppList: []
};

export default (state = initialState, action) => {

    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isloading: true,
            }

        case REMOVE_APPS: {
            let smApps = state.secureMarketList;

            if (action.payload.status) {
                message.success(action.payload.msg);
                console.log('at REMOVE_APPS reducer:: ', action.response[0])
                console.log(state.secureMarketList)
                if (action.response.length > 1) {
                    smApps = [];
                    // let apps = [];
                    // state.secureMarketList.forEach((app) => {
                    //     if (!action.response.includes(app.id)) {
                    //         apps.push(app);
                    //         smApps = apps;
                    //     }
                    // })
                    // smApps = state.secureMarketList.filter((app) => app.id !== action.response[0])
                } else {
                    smApps = state.secureMarketList.filter((app) => app.id !== action.response[0])
                }
                console.log(smApps)
            } else {
                message.error(action.payload.msg)
            }
            return {
                ...state,
                secureMarketList: smApps
            }
        }
        case TRANSFER_APPS:
            if (action.status) {
                message.success(action.msg)
                // success({
                //     title: "Apps Transferred Successfully",
                // });
            }
            return {
                ...state,
                secureMarketList: action.payload.marketApplist,
                availbleAppList: action.payload.availableApps,
                isloading: false

            }
        case GET_MARKET_APPS:
            return {
                ...state,
                isloading: false,
                secureMarketList: action.payload.marketApplist,
                availbleAppList: action.payload.availableApps
            }
        case UNINSTALL_PERMISSION_CHANGED:
            if (action.status) {
                message.success(action.msg)
            } else {
                message.error(action.msg)
            }

            return {
                ...state,
            }

        default:
            return state;

    }
}