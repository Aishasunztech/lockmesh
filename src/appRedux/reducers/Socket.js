import React, { Fragment } from 'react'
import {
    FINISHED_PUSH_APPS, FINISHED_PULL_APPS, IN_PROCESS, FINISHED_POLICY, FINISHED_IMEI, SINGLE_APP_PUSHED, GET_APP_JOBS
} from "../../constants/ActionTypes";
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
    is_in_process: false,
    noOfApp_pushed_pulled: 0,
    noOfApp_push_pull: 0,
    is_push_apps: 0
};

export default (state = initialState, action) => {

    switch (action.type) {
        case FINISHED_PUSH_APPS: {
            // console.log("works");
            success({
                title: "Apps Pushed Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
            }
        }
        case GET_APP_JOBS: {
            if (action.payload) {
                return {
                    ...state,
                    is_push_apps: action.payload.is_in_process,
                    noOfApp_push_pull: action.payload.total_apps,
                    noOfApp_pushed_pulled: action.payload.complete_apps,
                }
            } else {
                return {
                    ...state
                }
            }
        }
        case SINGLE_APP_PUSHED: {
            return {
                ...state,
                noOfApp_pushed_pulled: Number(state.noOfApp_pushed_pulled) + 1
            }
        }
        case FINISHED_PULL_APPS: {
            // console.log("works");
            success({
                title: "Apps Pulled Successfully.",
            });
            return {
                ...state,
                is_in_process: false
            }
        }
        case FINISHED_POLICY: {
            // console.log("works");
            success({
                title: "Policy Applied Successfully.",
            });
            return {
                ...state,
                is_in_process: false
            }
        }
        case IN_PROCESS: {
            // console.log("works");
            return {
                ...state,
                is_in_process: true,
            }
        }
        case FINISHED_IMEI: {
            success({
                title: "Imei Changed Successfully.",
            });
            return {
                ...state,
                is_in_process: false
            }
        }
        default:
            return state;
    }
}