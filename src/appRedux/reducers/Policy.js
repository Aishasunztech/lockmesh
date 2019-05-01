import {
    GET_POLICIES,
    APK_LIST,
    HANDLE_CHECK_APP_POLICY,
    GET_APPS_PERMISSIONS,
    GET_DEALER_APPS,
    HANDLE_CHECK_SYSTEM_PERMISSIONS,
    SAVE_POLICY,
    PERMSSION_SAVED
} from "../../constants/ActionTypes";
import {
    POLICY_NAME,
    POLICY_INFO,
    POLICY_NOTE,
    POLICY_COMMAND
} from "../../constants/PolicyConstants";

import { message } from "antd";

const initialState = {
    policies: [],
    msg: "",
    apk_list: [],
    app_list: [],
    dealer_apk_list: [],
    showMsg: false,
    isloading: true,
    selectedOptions: [],
    options: [ POLICY_NAME, POLICY_NOTE ],
    allExtensions: [],
    appPermissions: [],
    systemPermissions: [
    {name: "Wifi", value: true},
    {name: "Bluetooth", value: false},
    {name: "Screenshot", value: false},
    {name: "Location", value: false},
    {name: "Hotspot", value: false}]
};

export default (state = initialState, action) => {

    switch (action.type) {

        case GET_POLICIES:
            return {
                ...state,
                policies: action.payload
            }
        
        case APK_LIST: {
            return {
                ...state,
                isloading: false,
                apk_list: action.payload,
            }
        }

        case GET_APPS_PERMISSIONS: {
            console.log('data permissions', action.payload)
            return {
                ...state,
                appPermissions: action.payload.appPermissions,
                allExtensions: action.payload.extensions,
                systemPermissions: [...state.systemPermissions]

            }
        }

        case GET_DEALER_APPS: {

            return {
                ...state,
                dealer_apk_list: action.payload,
            }
        }

        case SAVE_POLICY: {
            if(action.response.status){
                message.success(action.response.msg)
            }else{
                message.error(action.response.msg)
            }

            return {
                ...state,
                dealer_apk_list: action.payload,
            }
        }

        case HANDLE_CHECK_SYSTEM_PERMISSIONS: {
           

            let changedState = state.systemPermissions;
            console.log(action.payload,'REDUCER INS PERMISDFAO', changedState)
            for(let item of changedState){
                if(item.name === action.payload.key){
                    item.value = action.payload.value
                }
            }
            state.systemPermissions = changedState;
            console.log(changedState, 'relst')

            return {
                ...state,
                systemPermissions: [...state.systemPermissions],
            }
        }

 
        case HANDLE_CHECK_APP_POLICY: {
            console.log('reducer', action.payload);
            if(action.payload.stateToUpdate === 'allExtensions'){

                    let changedExtensions = JSON.parse(JSON.stringify(state.allExtensions));
        
                    changedExtensions.forEach(extension => {
                        console.log(extension.uniqueName, '===', action.payload.uniqueName)
                        if (extension.uniqueName === action.payload.uniqueName) {
                            let objIndex = extension.subExtension.findIndex((obj => obj.id === action.payload.app_id));
                            if (objIndex > -1) {
                                extension.subExtension[objIndex][action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                                extension.subExtension[objIndex].isChanged = true;
                            }
                        }
                    });
        
                    state.allExtensions = JSON.parse(JSON.stringify(changedExtensions));
        
                    return {
                        ...state,
                        allExtensions: [...state.allExtensions],
                        // checked_app_id: {
                        //     id: action.payload.app_id,
                        //     key: action.payload.key,
                        //     value: action.payload.value
                        // },
                    }
                }
            
            else if(action.payload.stateToUpdate === 'dealerApps'){
                let changedApps = JSON.parse(JSON.stringify(state.dealer_apk_list));
                changedApps.forEach(app => {
                    console.log(app.app_id,'====', action.payload.app_id)
                    if (app.apk_id === action.payload.app_id) {
                        app.isChanged = true;
                        app[action.payload.key] = action.payload.value;
                    }
                });
    
                state.dealer_apk_list = JSON.parse(JSON.stringify(changedApps));
                let applications = state.dealer_apk_list;
              
                return {
                    ...state,
                    dealer_apk_list: changedApps,
                    checked_app_id: {
                        id: action.payload.app_id,
                        key: action.payload.key,
                        value: action.payload.value
                    },
                  
                }
            }

            else if(action.payload.stateToUpdate === 'appPermissions'){
                let changedApps = JSON.parse(JSON.stringify(state.appPermissions));
                changedApps.forEach(app => {
                    console.log(app.id,'====', action.payload.app_id ,app)
                    if (app.id === action.payload.app_id) {
                        app.isChanged = true;
                        app[action.payload.key] = action.payload.value;
                    }
                });
    
                state.appPermissions = JSON.parse(JSON.stringify(changedApps));
            
                return {
                    ...state,
                    appPermissions: changedApps,
                    checked_app_id: {
                        id: action.payload.app_id,
                        key: action.payload.key,
                        value: action.payload.value
                    },
                  
                }
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
        
        default: {

            return state;
        }

    }
}