import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Devices from "./Devices"
import Dealers from "./Dealer";
import Apk_List from "./Apk";
import ConnectDevice from "./ConnectDevice";
import Account from "./Account"
import Policy from "./Policy";
import Users from "./Users";


const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  devices: Devices,
  dealers: Dealers,
  apk_list: Apk_List,
  device_details: ConnectDevice,
  account: Account,
  policies: Policy,
  users: Users
});

export default reducers;
