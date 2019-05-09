import React, { Fragment } from 'react'
import {
    FINISHED_PUSH_APPS
} from "../../constants/ActionTypes";
import {
    message, Modal
} from 'antd';

const initialState = {
};

export default (state = initialState, action) => {

    switch (action.type) {
        case FINISHED_PUSH_APPS: {
            message.success("Apps Pushed Successfully.")
            return {
                ...state,
            }
        }
        default:
            return state;
    }
}