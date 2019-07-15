import {
    IMPORT_CSV,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    RELEASE_CSV,
    DUPLICATE_SIM_IDS,
    NEW_DATA_INSERTED,
    CREATE_BACKUP_DB,
    SHOW_BACKUP_MODAL,
    CHECK_BACKUP_PASS,
    SAVE_ID_PRICES,
    SAVE_PACKAGE,
    GET_PRICES,
    SET_PRICE,
    RESET_PRICE,
    GET_PACKAGES,
    PURCHASE_CREDITS
} from "../../constants/ActionTypes";
import { message, Modal } from "antd";

const success = Modal.success
const error = Modal.error

const initialState = {
    msg: "",
    showMsg: false,
    used_pgp_emails: [],
    used_sim_ids: [],
    used_chat_ids: [],
    duplicate_ids: [],
    duplicate_modal_show: false,
    duplicate_data_type: '',
    newData: [],
    backUpModal: false,
    prices: {
        sim_id: {},
        chat_id: {},
        pgp_email: {},
        vpn: {}
    },
    isPriceChanged: false,
    pricesCopy: {
        sim_id: {},
        chat_id: {},
        pgp_email: {},
        vpn: {}
    },
    packages: [],
    packagesCopy: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SAVE_ID_PRICES: {
            // console.log(action.response, 'response form save id prices')
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
            } else {
                error({
                    title: action.response.msg
                })
            }
            return {
                ...state,
                isPriceChanged: false
            }
        }
        case SAVE_PACKAGE: {
            // console.log(action.response, 'response form save id prices')
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                if (action.response.data.length) {
                    state.packages.push(action.response.data[0])
                }
            } else {
                error({
                    title: action.response.msg
                })
            }
            return {
                ...state
            }
        }

        case GET_PRICES: {
            // console.log(action.response, 'response of get prices')

            return {
                ...state,
                prices: action.response.data,
                pricesCopy: JSON.parse(JSON.stringify(action.response.data))

            }
        }

        case GET_PACKAGES: {
            // console.log(action.response, 'response of get prices')

            return {
                ...state,
                packages: action.response.data,
                packagesCopy: JSON.parse(JSON.stringify(action.response.data))

            }
        }

        case RESET_PRICE: {
            return {
                ...state,
                prices: state.pricesCopy,
                isPriceChanged: false
            }
        }

        case SET_PRICE: {
            let copyPrices = JSON.parse(JSON.stringify(state.prices));
            let price_for = action.payload.price_for;
            let field = action.payload.field;

            // console.log('price for', price_for, 'field', field, 'value', action.payload.value)
            if (price_for && price_for !== '') {
                copyPrices[price_for][field] = action.payload.value;
            }
            // console.log(copyPrices[price_for], 'prices are', field)
            return {
                ...state,
                prices: copyPrices,
                isPriceChanged: true
            }

        }

        case IMPORT_CSV:
            return {
                ...state,
                msg: action.payload.msg,
                showMsg: action.showMsg,
            }
        case GET_USED_PGP_EMAILS: {
            // alert("hello");
            return {
                ...state,
                used_pgp_emails: action.payload
            }
        }
        case GET_USED_CHAT_IDS: {
            // alert("hello");
            return {
                ...state,
                used_chat_ids: action.payload
            }
        }
        case GET_USED_SIM_IDS: {
            // alert("hello");
            return {
                ...state,
                used_sim_ids: action.payload
            }
        }

        case NEW_DATA_INSERTED: {

            if (action.payload.status && action.showMsg) {
                success({
                    title: action.payload.msg,
                });
            } else if (action.payload.status === false && action.showMsg) {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                duplicate_ids: [],
                duplicate_data_type: '',
                duplicate_modal_show: false,
                newData: []

            }
        }

        case DUPLICATE_SIM_IDS: {
            return {
                ...state,
                duplicate_ids: action.payload.duplicateData,
                duplicate_data_type: action.payload.type,
                duplicate_modal_show: true,
                newData: action.payload.newData
            }
        }
        case CREATE_BACKUP_DB: {
            return {
                ...state,

            }
        }

        case RELEASE_CSV: {
            // alert("hello");
            // console.log(action.payload);
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            }
            else {
                error({
                    title: action.payload.msg,
                });

            }
            if (action.payload.type === 'sim') {
                return {
                    ...state,
                    used_sim_ids: action.payload.data
                }
            } else if (action.payload.type === 'chat') {
                return {
                    ...state,
                    used_chat_ids: action.payload.data
                }
            } else if (action.payload.type === 'pgp') {
                return {
                    ...state,
                    used_pgp_emails: action.payload.data
                }
            } else {
                return {
                    ...state,
                }
            }
        }
        case CHECK_BACKUP_PASS:
            if (action.payload.PasswordMatch.password_matched) {
                return {
                    ...state,
                    backUpModal: true,
                }
            }
            else {
                error({
                    title: "Password Did not Match. Please Try again.",
                });
                return {
                    ...state,
                    backUpModal: false
                }
            }
        case SHOW_BACKUP_MODAL:
            // console.log(action.payload);

            return {
                ...state,
                backUpModal: action.payload,
            }
        case PURCHASE_CREDITS:
            // console.log(action.response);
            if (action.response.status) {

                success({
                    title: action.response.msg,
                });
            }
            else {
                error({
                    title: action.response.msg,
                });

            }
            return {
                ...state,
            }

        default:
            return state;
    }
}