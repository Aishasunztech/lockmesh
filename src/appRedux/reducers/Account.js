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
  PURCHASE_CREDITS,
  GET_OVERDUE_DETAILS,
  GET_PARENT_PACKAGES,
  PACKAGE_PERMSSION_SAVED,
  DELETE_PACKAGE,
  EDIT_PACKAGE,
  LATEST_PAYMENT_HISTORY,
  RESYNC_IDS,
  GET_HARDWARE,
  MODIFY_ITEM_PRICE, SALES_REPORT
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
  paymentHistory: [],
  overdueDetails: {},
  packagesCopy: [],
  hardwares: []
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
            let dump = [];
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                if (action.response.data.length) {
                    dump = JSON.parse(JSON.stringify(state.packages));
                    dump.push(action.response.data[0])
                }
            } else {
                error({
                    title: action.response.msg
                })
            }
            // console.log(state.packages, 'test deff',action.response, 'response form save id prices')
            return {
                ...state,
                packages: dump
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

        case GET_HARDWARE: {
            // console.log(action.response, 'response of get prices')

            return {
                ...state,
                hardwares: action.response.data,

            }
        }

        case RESET_PRICE: {
            return {
                ...state,
                prices: state.pricesCopy,
                isPriceChanged: false
            }
        }
        case RESYNC_IDS: {
            success({
                title: "ID's data Refreshed successfully",
            });
            return {
                ...state
            }
        }

        case SET_PRICE: {
            let copyPrices = JSON.parse(JSON.stringify(state.prices));
            let price_for = action.payload.price_for;
            let field = action.payload.field;
            let value = action.payload.value;

            value = +value;
            if (price_for && price_for !== '') {
                copyPrices[price_for][field] = value.toString();
            }
            // console.log(copyPrices[price_for], 'prices are', field)
            return {
                ...state,
                prices: copyPrices,
                isPriceChanged: true
            }
        }

      case LATEST_PAYMENT_HISTORY:
        return {
          ...state,
          paymentHistory: action.payload
        };

      case GET_OVERDUE_DETAILS:
        return {
          ...state,
          overdueDetails: action.payload
        };

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
                // success({
                //     title: action.payload.msg,
                // });
                return {
                    ...state,
                    backUpModal: true,
                }
            }
            else {
                error({
                    title: action.payload.msg,
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

        case PACKAGE_PERMSSION_SAVED: {
            // console.log("dasdasdad");
            success({
                title: action.payload
            });

            let objIndex = state.packages.findIndex((obj => obj.id === action.package_id));
            state.packages[objIndex].permission_count = action.permission_count;

            return {
                ...state,
                packages: [...state.packages]
            }
        }
        case DELETE_PACKAGE: {
            let packages = state.packages
            if (action.payload.status) {
                success({
                    title: action.payload.msg
                });
                let objIndex = packages.findIndex((obj => obj.id === action.package_id));
                // console.log(objIndex, "INDEX");
                if (objIndex > -1) {
                    packages.splice(objIndex, 1)
                }
            } else {
                error({
                    title: action.payload.msg
                });
            }

            return {
                ...state,
                packages: [...packages]
            }
        }
        case MODIFY_ITEM_PRICE: {
            // console.log(action.item_type);
            if (action.item_type === 'package') {
                let packages = state.packages
                if (action.payload.status) {
                    success({
                        title: action.payload.msg
                    });
                    let objIndex = packages.findIndex((obj => obj.id === action.package_id));
                    if (objIndex > -1) {
                        state.packages[objIndex].pkg_price = action.price;
                    }
                } else {
                    error({
                        title: action.payload.msg
                    });
                }

                return {
                    ...state,
                    packages: [...state.packages]
                }
            } else if (action.item_type === "hardware") {
                let hardwares = state.hardwares
                if (action.payload.status) {
                    success({
                        title: action.payload.msg
                    });
                    let objIndex = hardwares.findIndex((obj => obj.id === action.item_id));
                    if (objIndex > -1) {
                        state.hardwares[objIndex].hardware_price = action.price;
                    }
                } else {
                    error({
                        title: action.payload.msg
                    });
                }

                return {
                    ...state,
                    hardwares: [...state.hardwares]
                }
            }
        }

        default:
            return state;
    }
}
