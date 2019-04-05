import {
    GET_POLICIES,
    APK_LIST
} from "../../constants/ActionTypes";

const initialState = {
    policies: [],
    msg: "",
    apk_list: [],
    app_list: [],
    showMsg: false,
    isloading: true,
    selectedOptions: [],
    options: [ "POLICY NAME", "POLICY NOTE" ],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case GET_POLICIES:
            return {
                ...state,
                policies: action.payload
            }
        
        case APK_LIST: {
            return {
                ...state,
                isloading: false,
                apk_list: action.payload,
            }
        }
        default: {

            return state;
        }

    }
}