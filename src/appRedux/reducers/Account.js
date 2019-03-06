import {
    IMPORT_CSV
} from "constants/ActionTypes";

const initialState = {
    isloading: false,
    apk_list: [],
    selectedOptions: [],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case IMPORT_CSV:
            return {
                ...state
            }
        default:
            return state;

    }
}