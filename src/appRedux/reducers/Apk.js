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
	PERMISSION_SAVED,
	RESET_UPLOAD_FORM,
	CHECK_APK_NAME,
	AUTHENTICATE_UPDATE_USER,
	RESET_AUTH_UPDATE
} from "../../constants/ActionTypes";

import {
	APK_SHOW_ON_DEVICE,
	APK,
	APK_APP_NAME,
	APK_APP_LOGO,
	APK_PERMISSION
} from '../../constants/ApkConstants';
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
	isloading: false,
	apk_list: [],
	selectedOptions: [],
	DisplayPages: '10',
	// options: [
	// 	APK_PERMISSION,
	// 	APK_SHOW_ON_DEVICE,
	// 	APK,
	// 	APK_APP_NAME,
	// 	APK_APP_LOGO,
	// ],
	resetUploadForm: false,
	authenticateUpdateUser: false
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
			if (action.response.status) {
				success({
					title: action.response.msg,
				});
				state.apk_list = state.apk_list.filter(apk => apk.apk_id !== action.payload);

			}
			return {
				...state,
				isloading: false,
				apk_list: state.apk_list,
				options: state.options
			}

		case ADD_APK:
			// console.log(ADD_APK);
			let newApkList = state.apk_list
			if (action.response.status) {
				success({
					title: action.response.msg,
				});
				// console.log("INSERTED DATA", state.apk_list);
				newApkList.push(action.payload)
				// console.log("INSERTED DATA", state.apk_list);
			}
			else {
				error({
					title: action.response.msg,
				});
			}
			return {
				...state,
				apk_list: [...newApkList],
			}

		case EDIT_APK:
			// console.log('action edit id');
			// console.log(action.payload);
			// console.log(EDIT_APK);	
			let apkList = state.apk_list
			if (action.response.status) {

				success({
					title: action.response.msg,
				});
				let objIndex1 = apkList.findIndex((obj => obj.apk_id === action.payload.apk_id));
				if (objIndex1 !== undefined) {
					apkList[objIndex1] = action.payload
				}
			}
			else {
				error({
					title: action.response.msg,
				});;
			}
			return {
				...state,
				isloading: false,
				apk_list: [...apkList],
				options: state.options
			}

		case APK_STATUS_CHANGED: {
			// console.log(APK_STATUS_CHANGED)
			let objIndex = state.apk_list.findIndex((obj => obj.apk_id === action.payload));
			// console.log('index of item',objIndex);
			// message.success('Status Changed Successfully')
			message.success(action.msg)
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
		case PERMISSION_SAVED: {
			success({
				title: action.payload
			});;
			let dealers = JSON.parse(action.dealers)
			// console.log(dealers.length ,'itrititt',action.apk_id);
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
		case RESET_UPLOAD_FORM: {
			return {
				...state,
				resetUploadForm: action.payload
			}
		}

		case POST_DROPDOWN: {
			return {
				...state
			}
		}
		case CHECK_APK_NAME: {
			// console.log(action);
			if (action.response.status) {
				// console.log("ssadas");
			}
			return {
				...state
			}
		}
		case RESET_AUTH_UPDATE: {
			return {
				...state,
				authenticateUpdateUser: false
			}
		}
		case AUTHENTICATE_UPDATE_USER: {
			let authenticate = false
			if (action.payload.status) {
				authenticate = true
			} else {
				error({
					title: action.payload.msg, // 'Invalid email or password. Please try again.',
				});;
			}
			return {
				...state,
				authenticateUpdateUser: authenticate

			}
		}

		default:

			return state;

	}
}