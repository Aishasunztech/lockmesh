import {
    DEVICES_LIST,
    SUSPEND_DEVICE,
    CONNECT_DEVICE,
    EDIT_DEVICE,
    ACTIVATE_DEVICE,
    LOADING,
    GET_DROPDOWN,
    POST_DROPDOWN,
    GET_SIM_IDS
} from "constants/ActionTypes";
import { message } from 'antd';
import { stat } from "fs";


const initialState = {
    devices: [],
    msg: "",
    showMsg: false,
    isloading: true,
    selectedOptions:[],
    sim_ids:[],
    options: ["DEVICE ID", "DEVICE NAME", "ACCOUNT EMAIL", "PGP EMAIL", "CHAT ID", "CLIENT ID", "DEALER ID", "DEALER PIN", "MAC ADDRESS", "SIM ID", "IMEI 1", "SIM 1", "IMEI 2", "SIM 2", "SERIAL NUMBER", "STATUS", "MODEL", "START DATE", "EXPIRY DATE", "DEALER NAME", "ONLINE", "S DEALER", "S DEALER NAME"],
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

        case SUSPEND_DEVICE:
        if (action.response.status) {
            let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device.device_id));
            if (objIndex !== -1) {
                state.devices[objIndex] = action.payload.device;
            }
            message.success(action.response.msg);
        }
        else{
            message.success(action.response.msg);
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
            let objIndex1 = state.devices.findIndex((obj => obj.device_id === action.payload.device.device_id));
            if (objIndex1 !== -1) {
                state.devices[objIndex1] = action.payload.device;
            }
            message.success(action.response.msg);
        }
        else{
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
            return{
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
               selectedOptions: [...state.selectedOptions],
                options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
               // options: state.options,
               // devices: action.payload,
            }

            break;
        
        case GET_DROPDOWN:{
            // console.log(GET_DROPDOWN);
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            // console.log('reducer selected options', action.payload);
            if(action.payload.length === 0)
            {
                // console.log('array add', )
                action.payload[0] = 'ACTIONS';
            }
            // console.log('array', action.payload);
            return {
                ...state,
                selectedOptions: action.payload
            }
        }

        case POST_DROPDOWN:{
            return state
        }
        case GET_SIM_IDS:{
            // console.log(GET_SIM_IDS);
            // console.log(
            //     action.payload
            // )
            return {
                ...state,
                sim_ids: action.payload
            }
        }
        default:
            return state;

    }
}