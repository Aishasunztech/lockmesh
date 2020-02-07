import { STAND_ALONE_LIST, CHANGE_SIM_STATUS } from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success
const error = Modal.error

const initialState = {
    isloading: false,
    standAloneSimsList: [],
    options: [],
    action: '',
    msg: 'no message',
};

export default (state = initialState, action) => {

    switch (action.type) {

        case STAND_ALONE_LIST: {
            return {
                ...state,
                standAloneSimsList: action.payload
            }
        }

        case CHANGE_SIM_STATUS: {
            let simList = state.standAloneSimsList

            if (action.payload.status) {
                success({
                    title: action.payload.msg
                })
                let index = simList.findIndex(item => item.id == action.data.id)
                // console.log(index, action);
                if (index > -1) {
                    if (action.data.type === 'activate') {
                        simList[index].sim_status = 'active'
                    } else {
                        simList[index].sim_status = 'suspended'
                    }
                }
            } else {
                error({
                    title: action.payload.msg
                })
            }
            return {
                ...state,
                standAloneSimsList: [...simList]
            }
        }


        default:
            return state;

    }
}