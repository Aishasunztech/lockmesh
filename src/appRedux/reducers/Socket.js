import React, { Fragment } from 'react'
import {
    FINISHED_PUSH_APPS, FINISHED_PULL_APPS, PULL_PUSH_INPROCESS
} from "../../constants/ActionTypes";
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
    is_in_process: false
};

export default (state = initialState, action) => {

    switch (action.type) {
        case FINISHED_PUSH_APPS: {
            // console.log("works");
            success({
                title: "Apps Pushed Successfully.",
            });
            return {
                is_in_process: false
            }
        }
        case FINISHED_PULL_APPS: {
            // console.log("works");
            success({
                title: "Apps Pulled Successfully.",
            });
            return {
                is_in_process: false
            }
        }
        case PULL_PUSH_INPROCESS: {
            // console.log("works");
            return {
                is_in_process: true
            }
        }
        default:
            return state;
    }
}