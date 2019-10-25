import {
    INVALID_TOKEN, GET_QUE_JOBS
} from "../../constants/ActionTypes"

const initialStates = {
    tasks: []
}

export default (state = initialStates, action) => {
    switch (action.type) {
        case GET_QUE_JOBS:
            
            let tasks = action.payload
           
            return {
                ...state,
                tasks: tasks
            }

        default:
            return state;
    }
}