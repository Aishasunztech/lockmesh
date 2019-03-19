import {
    IMPORT_CSV
} from "constants/ActionTypes";

const initialState = {
    msg: "",
    showMsg: false,
};

export default (state = initialState, action) => {

    switch (action.type) {

        case IMPORT_CSV:
            return {
                msg: action.payload.msg,
                showMsg: action.showMsg,
            }
        default:
            return state;
    }
}