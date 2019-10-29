import {
    INVALID_TOKEN, GET_QUE_JOBS, 
} from "../../constants/ActionTypes"
import { SEND_JOB_TO_PANEL } from "../../constants/SocketConstants";

const initialStates = {
    tasks: []
}

export default (state = initialStates, action) => {
    switch (action.type) {
        case GET_QUE_JOBS: {
            let tasks = action.payload

            return {
                ...state,
                tasks: tasks
            }
        }
        case SEND_JOB_TO_PANEL: {
            if(action.payload){
                console.log("new task: ", action.payload);
                let index = state.tasks.findIndex((task)=> task.id === action.payload.id)
                console.log("new index: ", index);
                if(index === -1){
                    state.tasks.push(action.payload);
                }
            }
            return {
                ...state
            }
        }
        default:
            return state;
    }
}