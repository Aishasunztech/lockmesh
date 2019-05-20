import {
    TRANSFER_APPS,
    GET_MARKET_APPS,
    LOADING
} from "constants/ActionTypes";
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error
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
        case TRANSFER_APPS:
            if (action.status) {
                success({
                    title: "Apps Transferred Successfully",
                });
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

        default:
            return state;

    }
}