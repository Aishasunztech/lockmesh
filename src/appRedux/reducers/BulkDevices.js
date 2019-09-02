
import {
    BULK_SUSPEND_DEVICES, LOADING, BULK_DEVICES_LIST, BULK_LOADING, BULK_ACTIVATE_DEVICES, BULK_HISTORY,
} from "../../constants/ActionTypes";
import { message, Modal } from 'antd';


const success = Modal.success
const error = Modal.error


const initialState = {
    bulkDevices: [],
    bulkDevicesHistory: [],
    msg: "",
    showMsg: false,
    isloading: false,
};

export default (state = initialState, action) => {

    switch (action.type) {

        case BULK_LOADING:
            return {
                ...state,
                isloading: true,
                msg: state.msg,
                showMsg: "hello",
                bulkDevices: [],
            }

        case BULK_HISTORY:

            console.log("action.payload history at red : ", action.payload)
            return {
                ...state,
                isloading: false,
                bulkDevicesHistory: action.payload,
            }


        case BULK_DEVICES_LIST:
            return {
                ...state,
                isloading: false,
                bulkDevices: action.payload.data,
            }

        case BULK_SUSPEND_DEVICES:
            if (action.response.status) {

                console.log('BULK_SUSPEND_DEVICES ', state.bulkDevices)
                action.response.data.map((item) => {
                    let bulkObjIndex = state.bulkDevices.findIndex((obj => obj.device_id === item.device_id));
                    if (bulkObjIndex !== -1) {
                        state.bulkDevices[bulkObjIndex] = item;
                    }
                })
                success({
                    title: action.response.msg,
                });
            }
            else {
                error({
                    title: action.response.msg,
                });
            }

            console.log('BULK_SUSPEND_DEVICES after', state.bulkDevices)
            return {
                ...state,
                bulkDevices: [...state.bulkDevices],
                msg: action.response.msg,
                showMsg: true,
            }



        case BULK_ACTIVATE_DEVICES:

            console.log('at red BULK_ACTIVATE_DEVICES ', action.response)
            if (action.response.status) {

                action.response.data.map((item) => {
                    let objIndex = state.bulkDevices.findIndex((obj => obj.device_id === item.device_id));
                    if (objIndex !== -1) {
                        state.bulkDevices[objIndex] = item;
                    }
                })

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
                bulkDevices: [...state.bulkDevices],
                msg: action.response.msg,
                showMsg: true,
            }


        default:
            return state;
    }
}