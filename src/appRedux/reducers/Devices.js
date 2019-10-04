import {
    DEVICES_LIST,
    SUSPEND_DEVICE,
    CONNECT_DEVICE,
    EDIT_DEVICE,
    ACTIVATE_DEVICE,
    LOADING,
    GET_DROPDOWN,
    POST_DROPDOWN,
    GET_SIM_IDS,
    GET_CHAT_IDS,
    GET_PGP_EMAILS,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    REJECT_DEVICE,
    NEW_DEVICES_LIST,
    POST_PAGINATION,
    GET_PAGINATION,
    PRE_ACTIVATE_DEVICE,
    DELETE_UNLINK_DEVICE,
    UNFLAG_DEVICE,
    GET_PARENT_PACKAGES,
    UNLINK_DEVICE,
    TRANSFER_DEVICE,
    FLAG_DEVICE
} from "../../constants/ActionTypes";

// import { convertToLang } from '../../routes/utils/commonUtils';

// import {
//     DEVICE_ID,
//     USER_ID,
//     DEVICE_REMAINING_DAYS,
//     DEVICE_FLAGGED,
//     DEVICE_STATUS,
//     DEVICE_MODE,
//     DEVICE_NAME,
//     DEVICE_ACTIVATION_CODE,
//     DEVICE_ACCOUNT_EMAIL,
//     DEVICE_PGP_EMAIL,
//     DEVICE_CHAT_ID,
//     DEVICE_CLIENT_ID,
//     DEVICE_DEALER_ID,
//     DEVICE_DEALER_PIN,
//     DEVICE_MAC_ADDRESS,
//     DEVICE_SIM_ID,
//     DEVICE_IMEI_1,
//     DEVICE_SIM_1,
//     DEVICE_IMEI_2,
//     DEVICE_SIM_2,
//     DEVICE_SERIAL_NUMBER,
//     DEVICE_MODEL,
//     DEVICE_START_DATE,
//     DEVICE_EXPIRY_DATE,
//     DEVICE_DEALER_NAME,
//     DEVICE_S_DEALER,
//     DEVICE_S_DEALER_NAME,


// } from '../../constants/DeviceConstants';

import SettingStates from './InitialStates';
import { message, Modal } from 'antd';

var { translation } = SettingStates;


const success = Modal.success
const error = Modal.error


const initialState = {
    devices: [],
    msg: "",
    showMsg: false,
    isloading: true,
    selectedOptions: [],
    sim_ids: [],
    chat_ids: [],
    pgp_emails: [],

    parent_packages: [],
    // options: [
    //     { "key": DEVICE_ID, "value": convertToLang(translation[DEVICE_ID], DEVICE_ID) },
    //     { "key": USER_ID, "value": convertToLang(translation[USER_ID], USER_ID) },
    //     { "key": DEVICE_REMAINING_DAYS, "value": convertToLang(translation[DEVICE_REMAINING_DAYS], DEVICE_REMAINING_DAYS) },
    //     { "key": DEVICE_STATUS, "value": convertToLang(translation[DEVICE_STATUS], DEVICE_STATUS) },
    //     { "key": DEVICE_MODE, "value": convertToLang(translation[DEVICE_MODE], DEVICE_MODE) },
    //     { "key": DEVICE_FLAGGED, "value": convertToLang(translation[DEVICE_FLAGGED], DEVICE_FLAGGED) },
    //     { "key": DEVICE_NAME, "value": convertToLang(translation[DEVICE_NAME], DEVICE_NAME) },
    //     { "key": DEVICE_ACCOUNT_EMAIL, "value": convertToLang(translation[DEVICE_ACCOUNT_EMAIL], DEVICE_ACCOUNT_EMAIL) },
    //     { "key": DEVICE_CLIENT_ID, "value": convertToLang(translation[DEVICE_CLIENT_ID], DEVICE_CLIENT_ID) },
    //     { "key": DEVICE_ACTIVATION_CODE, "value": convertToLang(translation[DEVICE_ACTIVATION_CODE], DEVICE_ACTIVATION_CODE) },
    //     { "key": DEVICE_PGP_EMAIL, "value": convertToLang(translation[DEVICE_PGP_EMAIL], DEVICE_PGP_EMAIL) },
    //     { "key": DEVICE_SIM_ID, "value": convertToLang(translation[DEVICE_SIM_ID], DEVICE_SIM_ID) },
    //     { "key": DEVICE_CHAT_ID, "value": convertToLang(translation[DEVICE_CHAT_ID], DEVICE_CHAT_ID) },
    //     { "key": DEVICE_DEALER_ID, "value": convertToLang(translation[DEVICE_DEALER_ID], DEVICE_DEALER_ID) },
    //     { "key": DEVICE_DEALER_NAME, "value": convertToLang(translation[DEVICE_DEALER_NAME], DEVICE_DEALER_NAME) },
    //     { "key": DEVICE_DEALER_PIN, "value": convertToLang(translation[DEVICE_DEALER_PIN], DEVICE_DEALER_PIN) },
    //     { "key": DEVICE_MAC_ADDRESS, "value": convertToLang(translation[DEVICE_MAC_ADDRESS], DEVICE_MAC_ADDRESS) },
    //     { "key": DEVICE_IMEI_1, "value": convertToLang(translation[DEVICE_IMEI_1], DEVICE_IMEI_1) },
    //     { "key": DEVICE_SIM_1, "value": convertToLang(translation[DEVICE_SIM_1], DEVICE_SIM_1) },
    //     { "key": DEVICE_IMEI_2, "value": convertToLang(translation[DEVICE_IMEI_2], DEVICE_IMEI_2) },
    //     { "key": DEVICE_SIM_2, "value": convertToLang(translation[DEVICE_SIM_2], DEVICE_SIM_2) },
    //     { "key": DEVICE_SERIAL_NUMBER, "value": convertToLang(translation[DEVICE_SERIAL_NUMBER], DEVICE_SERIAL_NUMBER) },
    //     { "key": DEVICE_MODEL, "value": convertToLang(translation[DEVICE_MODEL], DEVICE_MODEL) },
    //     { "key": DEVICE_S_DEALER, "value": convertToLang(translation[DEVICE_S_DEALER], DEVICE_S_DEALER) },
    //     { "key": DEVICE_S_DEALER_NAME, "value": convertToLang(translation[DEVICE_S_DEALER_NAME], DEVICE_S_DEALER_NAME) },
    //     { "key": DEVICE_START_DATE, "value": convertToLang(translation[DEVICE_START_DATE], DEVICE_START_DATE) },
    //     { "key": DEVICE_EXPIRY_DATE, "value": convertToLang(translation[DEVICE_EXPIRY_DATE], DEVICE_EXPIRY_DATE) },
    // ],
    // options: ["DEVICE ID", "REMAINING DAYS", "FLAGGED", "STATUS", "MODE", "DEVICE NAME", "ACCOUNT EMAIL", "ACTIVATION CODE", "PGP EMAIL", "CHAT ID", "CLIENT ID", "DEALER ID", "DEALER PIN", "MAC ADDRESS", "SIM ID", "IMEI 1", "SIM 1", "IMEI 2", "SIM 2", "SERIAL NUMBER", "MODEL", "START DATE", "EXPIRY DATE", "DEALER NAME", "S-DEALER", "S-DEALER NAME"],
    newDevices: [],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:
            return {
                ...state,
                isloading: true,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                devices: [],
            }

        case DEVICES_LIST:
            return {
                ...state,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                devices: action.payload,
            }

        case FLAG_DEVICE: {
            if (action.response.status) {
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex].flagged = action.payload.device.flagged;
                    state.devices[objIndex].finalStatus = action.payload.device.finalStatus;
                }
            }
            return {
                ...state,
                devices: [...state.devices]
            }
        }

        case UNFLAG_DEVICE: {
            if (action.response.status) {
                // console.log('unflaged', action.response.device_id)
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex].flagged = 'Not flagged';
                    state.devices[objIndex].finalStatus = action.payload.device.finalStatus;
                }
            }
            return {
                ...state,
                devices: [...state.devices]
            }
        }

        case UNLINK_DEVICE: {
            console.log("UNLINK_DEVICE reducer:: ", action.payload)
            let devices = state.devices;

            if (action.response.status) {
                success({
                    title: action.response.msg,
                });

                let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex].unlink_status = 1;
                    state.devices[objIndex].finalStatus = "Unlinked";
                }

                // if (action.isTransferred) {
                //     devices = state.devices.filter((obj => obj.device_id !== action.payload.device_id));
                // }
            } else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log('unlink called');
            return {
                ...state,
                isLoading: false,
                devices
            }
        }

        case TRANSFER_DEVICE: {

            // console.log('check devices', state.devices)
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex].finalStatus = 'Transfered';
                    state.devices[objIndex].transfer_status = 1;
                }
            } else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log('unlink called');
            return {
                ...state,
                isLoading: false,
                devices: [...state.devices]
            }
        }

        case NEW_DEVICES_LIST:
            // console.log('reducer new device', action.payload);
            return {
                ...state,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                newDevices: action.payload,
            }

        case SUSPEND_DEVICE:
            if (action.response.status) {
                // console.log('dedlksjaflkj', action.response)
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex] = action.response.data;
                }
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
                devices: [...state.devices],
                msg: action.payload.msg,
                showMsg: true,
                // options: state.options,
            }


        case UNLINK_DEVICE:
            if (action.response.status) {
                console.log('UNLINK_DEVICE', action.response)
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex] = action.response.data;
                }
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
                devices: [...state.devices],
                isLoading: false
            }


        case ACTIVATE_DEVICE:
            if (action.response.status) {
                let objIndex1 = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
                if (objIndex1 !== -1) {
                    state.devices[objIndex1] = action.response.data;
                }
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
                devices: [...state.devices],
                msg: action.payload.msg,
                showMsg: true,
                // options: state.options,
            }

        case DELETE_UNLINK_DEVICE:
            if (action.response.status) {
                for (let id of action.response.data) {
                    let objIndex = state.devices.findIndex((obj => obj.id === id));
                    state.devices.splice(objIndex, 1);
                }
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }
            return {
                ...state,
                devices: [...state.devices],
                // options: state.options
            }

        case CONNECT_DEVICE:
            return {
                ...state,
            }
            break;


        case EDIT_DEVICE:
            let filteredDevices = state.newDevices;
            if (action.response.status) {
                let objIndex4 = state.devices.findIndex((obj => obj.device_id === action.payload.formData.device_id));
                state.devices[objIndex4] = action.response.data[0];

                var alldevices = state.newDevices;
                var device_id = action.payload.formData.device_id;
                filteredDevices = alldevices.filter(device => device.device_id !== device_id);

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
                devices: [...state.devices],
                newDevices: filteredDevices,
                //    selectedOptions: [...state.selectedOptions],
                // options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                options: state.options,
                // devices: action.payload,
            }

            break;

        case PRE_ACTIVATE_DEVICE:
            let devices = [...state.devices]
            if (action.response.status) {
                // console.log('pre activated device', action.response.data.data)
                // state.devices.push(action.response.data.data)
                success({
                    title: action.response.data.msg,
                });
                devices = [...action.response.data.data, ...state.devices]
                // message.success('done');
            }
            else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                devices: devices,
                //    selectedOptions: [...state.selectedOptions],
                // options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
            }

            break;

        case GET_DROPDOWN: {
            // console.log( "Reducer " ,action.payload)
            // console.log(GET_DROPDOWN);
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            // console.log('reducer selected options', action.payload);
            if (action.payload.length === 0) {
                // console.log('array add', )
                action.payload[0] = 'ACTIONS';
            }
            // console.log('array', action.payload);
            return {
                ...state,
                selectedOptions: action.payload
            }
        }
        case GET_PAGINATION: {
            // console.log(GET_DROPDOWN);
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            return {
                ...state,
                DisplayPages: action.payload
            }
        }


        case POST_DROPDOWN: {
            return state
        }

        case POST_PAGINATION: {
            return state
        }
        case GET_SIM_IDS: {
            // console.log(GET_SIM_IDS);
            // console.log(
            //     action.payload
            // )
            return {
                ...state,
                sim_ids: action.payload
            }
        }
        case GET_CHAT_IDS: {
            return {
                ...state,
                chat_ids: action.payload
            }
        }
        case GET_PGP_EMAILS: {
            // alert("hello");
            return {
                ...state,
                pgp_emails: action.payload
            }
        }
        case REJECT_DEVICE: {

            let filteredDevices = state.devices;
            let filteredNewDevices = state.newDevices;
            if (action.response.status) {
                // console.log(state.newDevices, 'new devices from reducer')
                var alldevices = state.devices;
                var device_id = action.device.device_id;
                filteredDevices = alldevices.filter(device => device.device_id !== device_id);
                filteredNewDevices = filteredNewDevices.filter(device => device.device_id !== device_id);
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                devices: filteredDevices,
                newDevices: filteredNewDevices,
            }
        }

        case GET_PARENT_PACKAGES:
            console.log(action.response.data);

            return {
                ...state,
                parent_packages: action.response.data,
            }
        default:
            return state;

    }
}