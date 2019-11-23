
import {
    BULK_SUSPEND_DEVICES, LOADING, BULK_DEVICES_LIST, BULK_LOADING, BULK_ACTIVATE_DEVICES, BULK_HISTORY, BULK_USERS, BULK_PUSH_APPS, SET_PUSH_APPS, SET_PULL_APPS, BULK_PULL_APPS, SET_SELECTED_BULK_DEVICES, UNLINK_BULK_DEVICES, WIPE_BULK_DEVICES, CLOSE_RESPONSE_MODAL, APPLY_BULK_POLICY,
} from "../../constants/ActionTypes";
import { message, Modal } from 'antd';


const success = Modal.success
const error = Modal.error
const warning = Modal.warning;


const initialState = {
    bulkDevices: [], // all filtered devices
    bulkDevicesHistory: [],
    msg: "",
    showMsg: false,
    isloading: false,
    usersOfDealers: [],
    selectedDevices: [], // again filter devices against applied action
    noOfApp_push_pull: 0,
    bulkSelectedPushApps: [],
    bulkSelectedPullApps: [],
    bulkResponseModal: false,
    failed_device_ids: [],
    queue_device_ids: [],
    pushed_device_ids: [],
    expire_device_ids: [],
    response_modal_action: ''
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SET_PUSH_APPS: {
            return {
                ...state,
                bulkSelectedPushApps: action.payload
            }
        }

        case SET_PULL_APPS: {
            return {
                ...state,
                bulkSelectedPullApps: action.payload
            }
        }

        case SET_SELECTED_BULK_DEVICES: {
            return {
                ...state,
                selectedDevices: action.payload
            }
        }


        case BULK_LOADING:
            return {
                ...state,
                isloading: true,
                msg: state.msg,
                showMsg: "hello",
                bulkDevices: [],
            }

        case BULK_HISTORY:

            // console.log("action.payload history at red : ", action.payload)
            return {
                ...state,
                isloading: false,
                bulkDevicesHistory: action.payload,
            }

        case BULK_USERS:

            // console.log("action.payload BULK_USERS at red : ", action.payload)
            if (action.payload.status) {
                return {
                    ...state,
                    isloading: false,
                    usersOfDealers: action.payload.users_list,
                }
            }



        case BULK_DEVICES_LIST:
            // console.log("action.payload BULK_DEVICES_LIST, ", action.payload)
            if (action.payload.status) {
                return {
                    ...state,
                    isloading: false,
                    bulkDevices: action.payload.data,
                    selectedDevices: [],
                    usersOfDealers: action.payload.users_list
                }
            } else {
                return {
                    ...state,
                }
            }


        case BULK_SUSPEND_DEVICES: {
            // console.log('BULK_SUSPEND_DEVICES reducer data:: ', action.payload, state.selectedDevices);

            let updatePrevBulkDevices = [];
            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {

                let allSuspendedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                updatePrevBulkDevices = state.bulkDevices.map((item) => {
                    let bulkObjIndex = allSuspendedDevices.findIndex(obj => obj === item.device_id);
                    if (bulkObjIndex !== -1) {
                        item.finalStatus = "Suspended";
                        item.account_status = "suspended";
                    }
                    return item;
                })
                if (action.payload.online && !action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else if (!action.payload.online && !action.payload.offline && !action.payload.failed && action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    state.expire_device_ids = action.payload.data.expire_device_ids;
                    showResponseModal = true;
                }

            } else {
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                expire_device_ids: [...state.expire_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "suspend",
                selectedDevices: []
            }
        }

        case BULK_ACTIVATE_DEVICES: {
            // console.log('BULK_ACTIVATE_DEVICES reducer data:: ', action.payload);

            let updatePrevBulkDevices = [];
            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {

                let allSuspendedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                updatePrevBulkDevices = state.bulkDevices.map((item) => {
                    let bulkObjIndex = allSuspendedDevices.findIndex(obj => obj === item.device_id);
                    if (bulkObjIndex !== -1) {
                        item.finalStatus = "Active";
                        item.account_status = "";
                    }
                    return item;
                })
                if (action.payload.online && !action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else if (!action.payload.online && !action.payload.offline && !action.payload.failed && action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    state.expire_device_ids = action.payload.data.expire_device_ids;
                    showResponseModal = true;
                }

            } else {
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                expire_device_ids: [...state.expire_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "active",
                selectedDevices: []
            }
        }


        case BULK_PUSH_APPS: {
            console.log('BULK_PUSH_APPS reducer data:: ', action.payload);

            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "push",
                selectedDevices: [],
                // bulkSelectedPushApps: []
            }
        }

        case BULK_PULL_APPS: {
            console.log('BULK_PULL_APPS reducer data:: ', action.payload);

            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg, // "Apps are Being puslled"
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "pull",
                selectedDevices: [],
                // bulkSelectedPullApps: []
            }
        }

        case UNLINK_BULK_DEVICES: {
            console.log('UNLINK_BULK_DEVICES reducer data:: ', action.payload, "state.bulkDevices ", state.bulkDevices);

            let updatePrevBulkDevices = [];
            let showResponseModal = state.bulkResponseModal;
            if (action.payload.status) {

                let allUnlinkedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                console.log("allUnlinkedDevices ", allUnlinkedDevices);
                updatePrevBulkDevices = state.bulkDevices.filter(item => !allUnlinkedDevices.includes(item.device_id))
                // updatePrevBulkDevices = state.bulkDevices.map((item) => {
                // let bulkObjIndex = allUnlinkedDevices.findIndex(obj => obj === item.device_id);
                // if (bulkObjIndex !== -1) {
                //     // item.finalStatus = "Unlinked";
                //     // item.unlink_status = 1;
                //     return item;
                // }
                // })
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "unlink",
                selectedDevices: []
            }
        }

        case WIPE_BULK_DEVICES: {
            console.log('WIPE_BULK_DEVICES reducer data:: ', action.payload, "state.bulkDevices ", state.bulkDevices);

            let updatePrevBulkDevices = [];
            let showResponseModal = state.bulkResponseModal;
            if (action.payload.status) {

                let allWipedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                console.log("allWipedDevices ", allWipedDevices);
                updatePrevBulkDevices = state.bulkDevices.filter(item => !allWipedDevices.includes(item.device_id))
                // updatePrevBulkDevices = state.bulkDevices.map((item) => {
                //     let bulkObjIndex = allWipedDevices.findIndex(obj => obj === item.device_id);
                //     if (bulkObjIndex === -1) {
                //         return item;
                //     }
                // })
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "wipe",
                selectedDevices: []
            }
        }

        case APPLY_BULK_POLICY: {
            console.log('APPLY_BULK_POLICY reducer data:: ', action.payload);

            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "policy",
                selectedDevices: []
            }
        }

        case CLOSE_RESPONSE_MODAL: {
            return {
                ...state,
                bulkResponseModal: false,
                failed_device_ids: [],
                queue_device_ids: [],
                pushed_device_ids: [],
                expire_device_ids: [],
            }
        }

        default:
            return state;
    }
}