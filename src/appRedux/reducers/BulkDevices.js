
import {
    BULK_SUSPEND_DEVICES, LOADING, BULK_DEVICES_LIST,
} from "../../constants/ActionTypes";
import { message, Modal } from 'antd';


const success = Modal.success
const error = Modal.error


const initialState = {
    bulkDevices: [],
    msg: "",
    showMsg: false,
    isloading: false,
};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:
            return {
                ...state,
                isloading: true,
                msg: state.msg,
                showMsg: "hello",
                bulkDevices: [],
            }

        case BULK_DEVICES_LIST:
            return {
                ...state,
                isloading: false,
                bulkDevices: action.payload,
            }

        case BULK_SUSPEND_DEVICES:
            if (action.response.status) {

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


            return {
                ...state,
                bulkDevices: [...state.bulkDevices],
                showMsg: true
            }

        default:
            return state;
    }
}