import {
	APK_LIST,
	ADD_APK,
	UNLINK_APK,
	EDIT_APK,
	APK_STATUS_CHANGED,
	LOADING,
	POST_DROPDOWN,
	GET_DROPDOWN,
	GET_PAGINATION,
	PERMSSION_SAVED
} from "constants/ActionTypes";
import { message } from 'antd';
import { DEALERS_LIST } from "../../constants/ActionTypes";

const initialState = {
	isloading: false,
	apk_list: [],
	selectedOptions: [],
	DisplayPages: '10',
	options: ['SHOW ON DEVICE', 'APK', 'APP NAME', 'APP LOGO']
};

export default (state = initialState, action) => {

	switch (action.type) {

		case LOADING:
			return {
				...state,
				isloading: true,
			}

		case APK_LIST:
			// console.log(action.payload);

			return {
				...state,
				isloading: false,
				apk_list: action.payload,
				options: state.options
			}


		case UNLINK_APK:

			// console.log(UNLINK_APK);
			state.apk_list = state.apk_list.filter(apk => apk.apk_id !== action.payload);

			return {
				...state,
				isloading: false,
				apk_list: state.apk_list,
				options: state.options
			}

		case ADD_APK:
			// console.log(ADD_APK);

			if (action.response.status) {
				message.success(action.response.msg)
			}
			else {
				message.error(action.response.msg)
			}
			return {
				...state,
				apk_list: [...state.apk_list],
			}

		case EDIT_APK:
			// console.log('action edit id');
			// console.log(action.payload);
			// console.log(EDIT_APK);			
			if (action.response.status) {
				let objIndex1 = state.apk_list.findIndex((obj => obj.apk_id === action.payload.apk_id));
				if (objIndex1 !== undefined) {
					state.apk_list[objIndex1].apk_name = action.payload.name
					state.apk_list[objIndex1].apk = action.payload.apk
					state.apk_list[objIndex1].logo = action.payload.logo
				}
				message.success(action.response.msg);
			}
			else {
				message.error(action.response.msg);
			}


			return {
				...state,
				isloading: false,
				apk_list: [...state.apk_list],
				options: state.options
			}

		case APK_STATUS_CHANGED: {
			// console.log(APK_STATUS_CHANGED)
			let objIndex = state.apk_list.findIndex((obj => obj.apk_id === action.payload));
			// console.log('index of item',objIndex);
			if (state.apk_list[objIndex].apk_status === 'Off') {
				// console.log('apk_status_off',state.apk_list[objIndex].apk_status);
				state.apk_list[objIndex].apk_status = "On";
			}
			else {
				// console.log('apk_status_on',state.apk_list[objIndex].apk_status);
				state.apk_list[objIndex].apk_status = "Off";
			}

			// console.log('new_apk_list',state.apk_list)
			return {
				...state,
				isloading: false,
				apk_list: [...state.apk_list],
				options: state.options
			}
		}
		case PERMSSION_SAVED: {
			message.success(action.payload);
			let dealers = JSON.parse(action.dealers)
			console.log(dealers.length ,'itrititt',action.apk_id);
			let objIndex = state.apk_list.findIndex((obj => obj.apk_id === action.apk_id));
			state.apk_list[objIndex].permission_count = action.permission_count;
			
			return {
				...state,
				apk_list: [...state.apk_list]
			}
		}
		case GET_PAGINATION: {
			// console.log(GET_PAGINATION)
			// console.log(GET_DROPDOWN);
			// console.log({
			//     ...state,
			//     selectedOptions: action.payload
			// });
			return {
				...state,
				DisplayPages: action.payload
			}
		}
		case GET_DROPDOWN: {
			// console.log(GET_DROPDOWN)
			// console.log(GET_DROPDOWN);
			// console.log({
			//     ...state,
			//     selectedOptions: action.payload
			// });
			return {
				...state,
				selectedOptions: action.payload
			}
		}

		case POST_DROPDOWN: {
			return {
				...state
			}
		}

		default:

			return state;

	}
}