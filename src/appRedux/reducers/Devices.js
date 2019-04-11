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
    REJECT_DEVICE,
    NEW_DEVICES_LIST,
    POST_PAGINATION,
    GET_PAGINATION,
    PRE_ACTIVATE_DEVICE
} from "../../constants/ActionTypes";
import { message } from 'antd';
import { stat } from "fs";


const initialState = {
    devices: [],
    msg: "",
    showMsg: false,
    isloading: true,
    selectedOptions: [],
    sim_ids: [],
    chat_ids: [],
    pgp_emails: [],
    options: ["DEVICE ID", "FLAGGED", "STATUS", "DEVICE NAME", "ACCOUNT EMAIL", "ACTIVATION CODE", "PGP EMAIL", "CHAT ID", "CLIENT ID", "DEALER ID", "DEALER PIN", "MAC ADDRESS", "SIM ID", "IMEI 1", "SIM 1", "IMEI 2", "SIM 2", "SERIAL NUMBER", "MODEL", "START DATE", "EXPIRY DATE", "DEALER NAME", "MODE", "S-DEALER", "S-DEALER NAME"],
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
                options: state.options,
                devices: [],
            }

        case DEVICES_LIST:
            return {
                ...state,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                options: state.options,
                devices: action.payload,
            }

        case NEW_DEVICES_LIST:
            // console.log('reducer new device', action.payload);
            return {
                ...state,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                options: state.options,
                newDevices: action.payload,
            }

        case SUSPEND_DEVICE:
            if (action.response.status) {
                console.log('dedlksjaflkj', action.response)
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex] = action.response.data;
                }
                message.success(action.response.msg);
            }
            else {
                message.error(action.response.msg);
            }


            return {
                ...state,
                devices: [...state.devices],
                msg: action.payload.msg,
                showMsg: true,
                options: state.options,
            }


        case ACTIVATE_DEVICE:
            if (action.response.status) {
                let objIndex1 = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
                if (objIndex1 !== -1) {
                    state.devices[objIndex1] = action.response.data;
                }
                message.success(action.response.msg);
            }
            else {
                message.error(action.response.msg);

            }
            return {
                ...state,
                devices: [...state.devices],
                msg: action.payload.msg,
                showMsg: true,
                options: state.options,
            }

        case CONNECT_DEVICE:
            return {
                ...state,
            }
            break;

        case EDIT_DEVICE:

            if (action.response.status) {
                let objIndex4 = state.devices.findIndex((obj => obj.device_id === action.payload.formData.device_id));
                state.devices[objIndex4] = action.response.data[0];

                message.success(action.response.msg);
            }
            else {
                message.error(action.response.msg)
            }

            return {
                ...state,
                devices: [...state.devices],
                //    selectedOptions: [...state.selectedOptions],
                options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                // devices: action.payload,
            }

            break;

        case PRE_ACTIVATE_DEVICE:

            if (action.response.status) {
                console.log('pre activated device', action.response.data.data[0])
                state.devices.push(action.response.data.data[0])
                message.success(action.response.data.msg);
                // message.success('done');
            }
            else {
                message.error(action.response.msg)
            }

            return {
                ...state,
                devices: [...state.devices],
                //    selectedOptions: [...state.selectedOptions],
                options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
            }

            break;

        case GET_DROPDOWN: {
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


            if (action.response.status) {
                message.success(action.response.msg);
            } else {
                message.error(action.response.msg);
            }

            var devices = state.devices;
            var device_id = action.device_id;
            var filteredDevices = devices.filter(device => device.device_id !== device_id);

            return {
                ...state,
                devices: filteredDevices,
            }
        }
        default:
            return state;

    }
}