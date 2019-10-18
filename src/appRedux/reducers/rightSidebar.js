import {
    INVALID_TOKEN, GET_QUE_JOBS
} from "../../constants/ActionTypes"

const initialStates = {
    completedTasks: [],
    pendingTasks: [],
}

export default (state = initialStates, action) => {
    switch (action.type) {
        case GET_QUE_JOBS:
            // console.log('action rightsidebar ',action.response);
            let pendingTasks = state.pendingTasks;
            let completedTasks = state.completedTasks;
            if (action.response.status) {
                 pendingTasks = [...state.pendingTasks, ...action.response.data.pendingTasks];
                 completedTasks = [...state.completedTasks, ...action.response.data.completedTasks];
    
            }
            return {
                ...state,
                pendingTasks: pendingTasks,
                completedTasks: completedTasks,
            }

        default:
            return state;
    }
}