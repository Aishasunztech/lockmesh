import {
    INVALID_TOKEN, GET_QUE_JOBS
} from "../../constants/ActionTypes"
import RestService from '../services/RestServices';

export function getQueJobs(status, filter, offset, limit) {
    return (dispatch) => {
        RestService.getQueJobs(status, filter, offset, limit).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_QUE_JOBS,
                        response: response.data,
                    });
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}