import React, { Fragment } from 'react'
import {
    FINISHED_PUSH_APPS, FINISHED_PULL_APPS, IN_PROCESS, FINISHED_POLICY, FINISHED_IMEI, SINGLE_APP_PUSHED, GET_APP_JOBS, SINGLE_APP_PULLED, FINISHED_POLICY_STEP
} from "../../constants/ActionTypes";
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
    is_in_process: false,
    noOfApp_pushed_pulled: 0,
    noOfApp_push_pull: 0,
    is_push_apps: 0,
    complete_policy_step: 0,
    is_policy_process: 0,
    is_policy_finish: false
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
                noOfApp_pushed_pulled: state.noOfApp_push_pull,
                is_policy_process: 0
            }
        }
        case GET_APP_JOBS: {
            if (action.payload.id) {
                if (action.data_type === 'policy') {
                    return {
                        ...state,
                        is_policy_process: action.payload.is_in_process,
                        complete_policy_step: action.payload.complete_steps,
                    }
                } else {
                    return {
                        ...state,
                        is_push_apps: action.payload.is_in_process,
                        noOfApp_push_pull: action.payload.total_apps,
                        noOfApp_pushed_pulled: action.payload.complete_apps,
                    }
                }
            } else {
                return {
                    ...state,
                    is_policy_process: 0,
                    is_push_apps: 0,
                    is_in_process: false,
                }
            }
        }
        case SINGLE_APP_PUSHED: {
            // console.log(action.payload.completePushApps);
            return {
                ...state,
                noOfApp_pushed_pulled: state.noOfApp_pushed_pulled + 1
            }
        }
        case SINGLE_APP_PULLED: {
            // console.log(action.payload.completePushApps);
            return {
                ...state,
                noOfApp_pushed_pulled: state.noOfApp_pushed_pulled + 1
            }
        }
        case FINISHED_PULL_APPS: {
            // console.log("works");
            success({
                title: "Apps Pulled Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                noOfApp_pushed_pulled: state.noOfApp_push_pull,
                is_policy_process: 0
            }
        }
        case FINISHED_POLICY: {
            // console.log("works");
            success({
                title: "Policy Applied Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                is_policy_process: 0,
                is_policy_finish: true,
                complete_policy_step: 0
            }
        }
        case FINISHED_POLICY_STEP: {
            return {
                ...state,
                complete_policy_step: state.complete_policy_step + 1
            }
        }
        case IN_PROCESS: {
            // console.log("works");
            return {
                ...state,
                is_in_process: true,
                is_policy_finish: false
            }
        }
        case FINISHED_IMEI: {
            success({
                title: "Imei Changed Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                is_policy_process: 0
            }
        }
        default:
            return state;
    }
}