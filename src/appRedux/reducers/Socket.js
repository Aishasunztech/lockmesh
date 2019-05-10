import React, { Fragment } from 'react'
import {
    FINISHED_PUSH_APPS, FINISHED_PULL_APPS
} from "../../constants/ActionTypes";
import {
    message, Modal
} from 'antd';

const initialState = {
};

export default (state = initialState, action) => {

    switch (action.type) {
        case FINISHED_PUSH_APPS: {
            console.log("works");
            message.success("Apps Pushed Successfully.")
            return {
                ...state,
            }
        }
        case FINISHED_PULL_APPS: {
            console.log("works");
            message.success("Apps Pulled Successfully.")
            return {
                ...state,
            }
        }
        default:
            return state;
    }
}